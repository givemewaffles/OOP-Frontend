import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  colors
} from '@material-ui/core';
import * as API from '../../api';
import { CollectionsBookmarkRounded } from '@material-ui/icons';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

const ChinaData = (props) => {
  const theme = useTheme();
  const allYears = [2021, 2020, 2019, 2018];
  const allCategories = ["Gasoline", "Crude petroleum oils", "Naphtha", "Aviation kerosene", "Diesel oil", "Natural gases"];
  const allTypes = ['Export', 'Import'];
  const [retrievedData, setRetrievedData] = React.useState(false);
  const [year, setYear] = React.useState(allYears[0]);
  const [category, setCategory] = React.useState(allCategories[0]);
  const [type, setType] = React.useState(allTypes[0]);
  const [resultExists, setResultExists] = React.useState(false);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [18, 5, 19, 27, 29, 19, 20],
        label: '2018',
        maxBarThickness: 10
      },
      // {
      //   backgroundColor: colors.grey[200],
      //   barPercentage: 0.5,
      //   barThickness: 12,
      //   borderRadius: 4,
      //   categoryPercentage: 0.5,
      //   data: [11, 20, 12, 29, 30, 25, 13],
      //   label: 'Last year',
      //   maxBarThickness: 10
      // }
    ],
    labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug']
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const getMonth = (monthNumber) => {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return monthNames[monthNumber-1];
  }

  function updateURL(config) {
    let updatedURL = "http://localhost:8080/api/chinaData?"; 
    
    if (config.type != null) {
      updatedURL += `type=${config.type}&`;
    }
    if (config.category != null) {
      updatedURL += `category=${config.category}&`;
    }
    if (config.year != null) {
      updatedURL += `year=${config.year}`
    }
  
    return updatedURL
  
  }

  const refreshData = () => {
    const myHeaders = new Headers();
    myHeaders.append("Host", "localhost:8080");
    myHeaders.append("Referer", "http://localhost:3000");
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      // mode: 'cors'
    };

    const config = {
      "year": year, 
      "category": category,
      "type": type
    }

    let apiURL = updateURL(config);
    // console.log(apiURL)

    fetch(apiURL, requestOptions)
      .then(function(result) { return result.json() })
      .then(function(res) { 
        let months =  [];
        let qty =  [];
        res.forEach(entry => {
          months.push(getMonth(entry.month));
          qty.push(entry.final_quantity)
        });
        setRetrievedData(
          {
            datasets: [
              {
                backgroundColor: colors.indigo[500],
                barPercentage: 0.5,
                barThickness: 12,
                borderRadius: 4,
                data: qty,
              }
            ],
            labels: months
          }
        )
        console.log("data retrieved")
        setResultExists(true);
      })
      .catch(error => {
        console.log('error', error)
        setResultExists(false);
      });
  }

  useEffect(() => {
    refreshData()
  }, [year, category, type])

  return (
    <Card {...props}>
      <CardHeader
        action={(
          <>
            {/* <Button
              endIcon={<AutorenewIcon />}
              size="small"
              variant="text"
              onClick={refreshData}
            >
              Refresh Data
            </Button> */}
          </>
        )}
        title="Gasoline Volumes over Time"
      />
      <div style={{display: 'flex', flexDirection: 'row'}}>
      <InputLabel id="yearLabel">Year</InputLabel>
      <Select
        labelId="yearLabel"
        id="demo-simple-select-standard"
        value={year}
        onChange={handleYearChange}
        label="Year"
      >
        {allYears.map((e) => {
          return (
            <MenuItem value={e}>{e}</MenuItem>
          )
        })}
      </Select>
      <InputLabel id="categoryLabel">Category</InputLabel>
      <Select
        labelId="categoryLabel"
        id="demo-simple-select-standard"
        value={category}
        onChange={handleCategoryChange}
        label="Category"
      >
        {allCategories.map((e) => {
          return (
            <MenuItem value={e}>{e}</MenuItem>
          )
        })}
      </Select>
      <InputLabel id="typeLabel">Type</InputLabel>
      <Select
        labelId="typeLabel"
        id="demo-simple-select-standard"
        value={type}
        onChange={handleTypeChange}
        label="Type"
      >
        {allTypes.map((e) => {
          return (
            <MenuItem value={e}>{e}</MenuItem>
          )
        })}
      </Select>
      </div>
      <Divider />
      {resultExists && <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={retrievedData}
            options={options}
          />
        </Box>
      </CardContent>}
      {!resultExists && <CardContent>
        <Typography>No Results Found!</Typography>
      </CardContent>}
    </Card>
  );
};

export default ChinaData;
