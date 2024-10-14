import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import DatePicker from './components/Datepicker';
import SparklineChart from './components/SparklineChart';
import TimeSeriesChart from './components/TimeSeriesChart';
import ColumnChart from './components/ColumnChart';
import './App.css';



 // Comment out this line to isolate the issue
import Papa from 'papaparse';
import { parseISO, isWithinInterval } from 'date-fns';

const App = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const csvUrl = `${process.env.PUBLIC_URL}/hotel_bookings_1000.csv`;

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        if (results && results.data && results.data.length > 0) {
          setFilteredData(results.data);
          setLoading(false); // Data has been loaded
        } else {
          console.error("No data parsed or an error occurred.");
          setLoading(false); // No data, stop loading
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setLoading(false); // Error occurred, stop loading
      },
    });
  }, [csvUrl]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);

    if (filteredData.length > 0) {
      const filtered = filteredData.filter((booking) => {
        const date = new Date(
          `${booking.arrival_date_year}-${convertMonthToNumber(booking.arrival_date_month)}-${booking.arrival_date_day_of_month}`
        );
        return isWithinInterval(date, { start: parseISO(start), end: parseISO(end) });
      });

      setFilteredData(filtered);
    }
  };

  const convertMonthToNumber = (month) => {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    return months[month] || 1;
  };

  const aggregatedData = {
    timeSeries: filteredData.length > 0
      ? filteredData.map((booking) => ({
          date: `${booking.arrival_date_year}-${convertMonthToNumber(booking.arrival_date_month)}-${booking.arrival_date_day_of_month}`,
          visitors: (booking.adults || 0) + (booking.children || 0) + (booking.babies || 0),
        }))
      : [],
    countries: filteredData.length > 0
      ? Object.entries(
          filteredData.reduce((acc, booking) => {
            acc[booking.country] = (acc[booking.country] || 0) + (booking.adults || 0) + (booking.children || 0) + (booking.babies || 0);
            return acc;
          }, {})
        ).map(([country, visitors]) => ({ country, visitors }))
      : [],
    adults: filteredData.length > 0
      ? filteredData.reduce((acc, booking) => acc + (parseInt(booking.adults || 0, 10)), 0)
      : 0,
    children: filteredData.length > 0
      ? filteredData.reduce((acc, booking) => acc + (parseInt(booking.children || 0, 10)), 0)
      : 0,
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Loading data...
        </Typography>
      </Container>
    );
  }

  // Temporary debugging: Comment out one chart at a time to see which chart is causing the issue
  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h3" gutterBottom align="center" style={{ color: '#3f51b5' }}>
        Hotel Booking Dashboard
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
        <DatePicker onDateChange={handleDateChange} />
      </Paper>

      {filteredData.length > 0 ? (
        <Grid container spacing={4}>
          {/* Time Series and Column Chart */}
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#e3f2fd' }}>
              <Typography variant="h6" gutterBottom align="center" style={{ color: '#1976d2' }}>
                Visitors Over Time
              </Typography>
              {aggregatedData.timeSeries.length > 0 ? (
                <TimeSeriesChart data={aggregatedData.timeSeries} />
              ) : (
                <Typography variant="body2" align="center">No data available for Time Series</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#e8f5e9' }}>
              <Typography variant="h6" gutterBottom align="center" style={{ color: '#388e3c' }}>
                Visitors By Country
              </Typography>
              {aggregatedData.countries.length > 0 ? (
                <ColumnChart data={aggregatedData.countries} />
              ) : (
                <Typography variant="body2" align="center">No data available for Countries</Typography>
              )}
            </Paper>
          </Grid>

          {/* Sparkline Charts */}
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#ffebee' }}>
              <Typography variant="h6" gutterBottom align="center" style={{ color: '#d32f2f' }}>
                Total Adult Visitors
              </Typography>
              {filteredData.length > 0 ? (
                <SparklineChart
                  title="Adult Visitors"
                  total={aggregatedData.adults}
                  data={filteredData.map((b) => parseInt(b.adults || 0, 10))}
                />
              ) : (
                <Typography variant="body2" align="center">No data available for Adult Visitors</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#fff3e0' }}>
              <Typography variant="h6" gutterBottom align="center" style={{ color: '#f57c00' }}>
                Total Children Visitors
              </Typography>
              {filteredData.length > 0 ? (
                <SparklineChart
                  title="Children Visitors"
                  total={aggregatedData.children}
                  data={filteredData.map((b) => parseInt(b.children || 0, 10))}
                />
              ) : (
                <Typography variant="body2" align="center">No data available for Children Visitors</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
          No data available.
        </Typography>
      )}
    </Container>
  );
};

export default App;
