import { deleteChartUsingPOST, listMyChartByPageUsingPOST } from '@/services/yubi/chartController';
import { DeleteOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, Input, List, message, Popconfirm, Result } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// 我的图表页面
const MyChart: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 6,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const { Search } = Input;

  const [chartId, setChartId] = useState<API.DeleteRequest>({
    id: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setChartList([]);
      const res = await listMyChartByPageUsingPOST(searchParams);
      console.log('LOADING......');
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);

        // 隐藏图标 title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.status === 'succed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败，' + e.message);
    }
    setLoading(false);
  }, [chartList]);

  const chartIdRef = useRef<API.DeleteRequest>();
  useEffect(() => {
    chartIdRef.current = chartId;
    if (chartId.id !== 0) {
      deleteChartUsingPOST(chartIdRef.current);
      console.log('触发请求,chartIdRef.cur:', chartIdRef.current);
      setTimeout(() => {
        loadData();
        console.log('重新渲染完毕');
      }, 1000);
    }
  }, [chartId]);
  // TODO：FIXME
  const deleteChart = async (cid: any) => {
    setChartId({ id: cid });
    console.log('chartId', chartId);
    message.success("删除成功");
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  // 取消删除提示
  const cancel = () => {
    message.error('cancel');
  };

  return (
    <div className="my-chart">
      <div className="margin-btm-16">
        <Search
          placeholder="请输入图表名称"
          loading={loading}
          enterButton
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            {`'testId:${item.id}'`}
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {item.status === 'wait' && (
                  <Result
                    status="warning"
                    title="图表待生成"
                    subTitle={item.execMessage ?? '当前图表生成队列繁忙,请耐心等候'}
                  />
                )}
                {item.status === 'running' && (
                  <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                )}
                {item.status === 'succeed' && (
                  <>
                    <div className="margin-btm-16"></div>
                    <p>
                      <span className="font-700-18px-SimSun">{item.goal}</span>
                    </p>
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  </>
                )}
                {item.status === 'failed' && (
                  <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                )}
              </>
              <Popconfirm
                title="删除图表"
                description="确定要删除此图表吗?"
                onConfirm={() => deleteChart(item.id as API.DeleteRequest)}
                onCancel={cancel}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  danger
                  shape="circle"
                  // BUG
                  // onClick={() => deleteChart(item.id as API.DeleteRequest)}
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyChart;
