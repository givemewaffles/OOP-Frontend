import React from 'react';

import axios from 'axios';

import baseURL from '../api';

export function getChinaDataByTypeCatYr(type, cat, yr) {
  axios.get(`${baseURL}type=${type}&category=${cat}&year=${yr}`)
    .then(res => {
      this.setState({ res });
    })
};


