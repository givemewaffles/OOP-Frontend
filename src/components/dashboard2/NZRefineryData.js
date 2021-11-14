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
  colors,
  TextField
} from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { Autocomplete } from '@mui/material';

const NZRefineryData = (props) => {
  const theme = useTheme();
  const allYears = ["1978","1979","1980","1981","1982","1983","1984","1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"];
  const allProdGrps = ["Crude Oil, Condensate and Naphtha","","Blendstocks and other refinery feedstocks","LPG","Petrol","Regular Petrol","Premium Petrol","Synthetic Petrol","Diesel","Fuel Oil","Aviation Fuels","Jet A1","Avgas","Lighting Kerosene","Other Petroleum Products"];
  const allTypes = ["Refinery Intake","Refinery Output", "Supply", "Imports", "Exports"];
  const [retrievedData, setRetrievedData] = React.useState(false);
  const [year, setYear] = React.useState(allYears[0]);
  const [prodGrp, setProdGrp] = React.useState(allProdGrps[0]);
  const [type, setType] = React.useState(allTypes[0]);
  const [resultExists, setResultExists] = React.useState(false);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleProdGrpChange = (event) => {
    setProdGrp(event.target.value);
  };
  
  const handleTypeChange = (event) => {
    setType(event.target.value);
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
    let updatedURL = `http://localhost:8080/api/NewZealand/query?`; 
    
    if (config.type != null) {
      updatedURL += `type=${config.type}&`;
    }
    if (config.productGroup != null) {
      updatedURL += `productGroup=${config.productGroup}&`;
    }
    if (config.year != null) {
      updatedURL += `year=${config.year}`
    }
  
    return String(updatedURL)
  
  }

  const refreshData = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    const config = {
      "year": year, 
      "product_group": prodGrp,
      "type": type
    }

    // "http://localhost:8080/api/NewZealand/query?" + new URLSearchParams(
    //   {
    //     productGroup: prodGrp,
    //     type: type,
    //     year: year
    //   }
    // )
    const apiURL = `http://localhost:8080/api/NewZealand/query?productGroup=${prodGrp}&year=${year}&type=${type}`
    fetch(apiURL, requestOptions)
      .then(response => response.json())
      .then(res => { 
        console.log(res)
        let months =  [];
        let qty =  [];
        // for (let i=0; i < res.length; i++) {
        // }
        res.forEach(entry => {
          months.push(getMonth(entry.month));
          qty.push(entry.quantity);
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
                label: 'Quantity'
              }
            ],
            labels: months
          }
        )
        console.log("NZ Refinery data retrieved")
        setResultExists(true);
      })
      .catch(error => {
        console.log('error', error)
        setResultExists(false);
      });
  }

  useEffect(() => {
    refreshData()
  }, [year, prodGrp, type])

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
        title="New Zealand Refinery Data over Time"
      />
      <div style={{display: 'flex', flexDirection: 'row'}}>
      <InputLabel id="yearLabel">Year</InputLabel>
      <Autocomplete isOptionEqualToValue={(option, value) => option === value} value={year} onChange={(event, newValue) => { setYear(String(newValue)) }} options={allYears} sx={{ width: 130 }} renderInput={(params) => <TextField {...params} />} />
      {/* <Select
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
      </Select> */}

      <InputLabel id="categoryLabel">Category</InputLabel>
      <Autocomplete 
        value={prodGrp} 
        onChange={(event, newValue) => {
          setProdGrp(newValue);
        }}
        options={allProdGrps} 
        sx={{ width: 150 }} 
        renderInput={(params) => <TextField {...params} />} 
      />
      {/* <Select
        labelId="categoryLabel"
        id="demo-simple-select-standard"
        value={prodGrp}
        onChange={handleProdGrpChange}
        label="Category"
      >
        {allProductGroups.map((e) => {
          return (
            <MenuItem value={e}>{e}</MenuItem>
          )
        })}
      </Select> */}
      <InputLabel id="typeLabel">Type</InputLabel>
      <Autocomplete value={type} onChange={(event, newValue) => { setType(newValue) }} options={allTypes} sx={{ width: 150 }} renderInput={(params) => <TextField {...params} />} />
      {/* <Select
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
      </Select> */}
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

export default NZRefineryData;
