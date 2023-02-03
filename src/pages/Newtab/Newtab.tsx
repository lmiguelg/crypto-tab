import React, { useState, useEffect } from 'react';
import {
  AreaSeries,
  AreaSeriesPoint,
  GradientDefs,
  HorizontalGridLines,
  LineSeries,
  LineSeriesPoint,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import { useIntl, FormattedNumber } from 'react-intl';
import './Newtab.css';
import { Currency } from './types';
import CaretUp from './icons/CaretUp';
import CaretDown from './icons/CaretDown';

const headers = [
  'Name',
  'Last Price',
  '24h Change',
  'Market Cap',
  'Volume(24h)',
  'Last 7 days',
];

const Newtab = () => {
  const [currency, setCurrency] = useState<Currency[]>([]);
  const getLang = () => navigator.language || 'en';
  const [date, setDate] = useState(new Date());

  const MINUTE_MS = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h&sparkline=true'
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrency(data);
      });
  }, []);

  return (
    <div className="App">
      <div className="flex flex-col justify-center items-center gap-4 h-screen bg-slate-900">
        <div className="pb-6 text-center">
          <h1 className="text-gray-400 text-7xl">
            {new Intl.DateTimeFormat(getLang(), {
              hour: 'numeric',
              minute: 'numeric',
            }).format(date)}
          </h1>
          <h1 className="text-gray-400 text-lg">
            {new Intl.DateTimeFormat(getLang(), {
              weekday: 'short',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }).format(new Date())}
          </h1>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {headers.map((label) => (
                    <th key={label} scope="col" className="px-6 py-3">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currency.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="flex gap-4">
                        <img
                          className="h-6 w-6 rounded-full ring-2 ring-white"
                          src={item.image}
                          alt={item.name}
                        />
                        <div>{item.name}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4 text-right">
                      <FormattedNumber
                        value={item.current_price}
                        currency="USD"
                        // eslint-disable-next-line react/style-prop-object
                        style="currency"
                      />
                    </td>
                    {item.price_change_percentage_24h > 0 ? (
                      <td className="px-6 py-4 text-green-500 text-right flex items-center">
                        <CaretUp width={25} height={25} fill="green" />
                        <FormattedNumber
                          value={item.price_change_percentage_24h}
                          maximumFractionDigits={2}
                        />
                        %
                      </td>
                    ) : (
                      <td className="px-6 py-4 text-rose-400 text-right flex items-center">
                        <CaretDown width={25} height={25} fill="red" />
                        <FormattedNumber
                          value={Math.abs(item.price_change_percentage_24h)}
                          maximumFractionDigits={2}
                        />
                        %
                      </td>
                    )}

                    <td className="px-6 py-4 text-right">
                      <FormattedNumber
                        value={item.market_cap}
                        currency="USD"
                        // eslint-disable-next-line react/style-prop-object
                        style="currency"
                        notation="compact"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <FormattedNumber
                        value={item.total_volume}
                        currency="USD"
                        // eslint-disable-next-line react/style-prop-object
                        style="currency"
                        notation="compact"
                      />
                    </td>
                    <td>
                      <XYPlot height={55} width={120} yRange={[30, 0]}>
                        <LineSeries
                          height={55}
                          width={120}
                          data={item?.sparkline_in_7d?.price.reduce(
                            (previousValue, currentValue, currentIndex) =>
                              currentIndex % 5 === 0
                                ? [
                                    ...previousValue,
                                    {
                                      x: currentIndex,
                                      y: currentValue,
                                    },
                                  ]
                                : previousValue,
                            [] as LineSeriesPoint[]
                          )}
                          opacity={0.7}
                          style={{ strokeLinejoin: 'round' }}
                        />
                      </XYPlot>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <h1 className="text-gray-500">Last updated a few seconds ago</h1>
      </div>
    </div>
  );
};

export default Newtab;
