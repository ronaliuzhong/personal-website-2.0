import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { moodHistory } from '../../../data/moodHistory'
import './MoodChart.css'

function MoodChart() {
  return (
    <div className="mood-chart">
      <p className="mood-chart__intro">
        I've been rating my month out of 10 on my favorite finsta account since {moodHistory[0]?.month || 'the beginning'}—here's the data so far.
      </p>
      <div className="mood-chart__wrap">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={moodHistory} margin={{ top: 8, right: 16, left: -16, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D3D1C7" />
            <XAxis
              dataKey="month"
              angle={-60}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, fill: '#888780' }}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fill: '#888780' }}
            />
            <Tooltip
              contentStyle={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                border: '1px solid #D3D1C7',
                borderRadius: 6,
              }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#27500A"
              strokeWidth={2}
              dot={{ fill: '#27500A', r: 2 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MoodChart