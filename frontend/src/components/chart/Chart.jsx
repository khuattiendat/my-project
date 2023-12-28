import "./chart.scss";
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {formatPrice} from "../../utils/format";
import {useEffect, useState} from "react";

const data1 = [
    {name: "Tháng 1", Total: 1200},
    {name: "Thang 2", Total: 2100},
    {name: "Thang 3", Total: 800},
    {name: "Thang 4", Total: 1600},
    {name: "Thang 5", Total: 900},
    {name: "Thang 6", Total: 1700},
    {name: "Thang 7", Total: 1200},
    {name: "Thang 8", Total: 2100},
    {name: "Thang 9", Total: 800},
    {name: "Thang 10", Total: 1600},
    {name: "Thang 11", Total: 900},
    {name: "Thang 12", Total: 1700},
];

const Chart = ({aspect, title, data}) => {
    const [dataRender, setDataRender] = useState([]);

    useEffect(() => {
        console.log(data)
        let dataRender = data.map((item) => {
            return {
                name: "Tháng" + item.month,
                Total: item.total,
            };
        })
        setDataRender(dataRender.reverse())
    }, [data])
    return (
        <div className="chart">
            <div className="title">{title}</div>
            <ResponsiveContainer width="100%" height="100%" maxHeight="100%" aspect={aspect}>
                <AreaChart
                    width={730}
                    height={250}
                    data={dataRender}
                    margin={{top: 10, right: 30, left: 0, bottom: 0}}
                >
                    <defs>
                        <linearGradient id="total" x1="0" y1="1" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={1}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="gray"/>
                    <CartesianGrid strokeDasharray="3 3" className="chartGrid"/>
                    <Tooltip
                        formatter={(value) => {
                            return formatPrice(value);
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="Total"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#total)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
