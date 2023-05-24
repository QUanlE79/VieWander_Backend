import express from 'express'
import axios from 'axios';
const Router = express.Router();
const mapQuestKey = `VvlIGiR1ZuvZDNIUbVoxM4aL3wHwcfIc`
Router.get("/",async (req,res)=>{
    if(!req.query.start || !req.query.end || req.query.start.length == 0 || req.query.end.length == 0){
      return res.json({
        status: 404,
        message: "Missing location",
        data: null
      })
    }
    let startLoc = removeCityPrefix(req.query.start)
    let endLoc = removeCityPrefix(req.query.end)
    const response = await axios.get(`https://www.mapquestapi.com/directions/v2/route?key=${mapQuestKey}&from=${startLoc}&to=${endLoc}&unit=k`)
    const route = response.data
    if(!route || route.info.statuscode != 0){
      return res.json({
        status: 404,
        message: "We are unable to route with the given locations",
        data: null
      })
    }
    let cityRoute = []
    let queries = splitLocationsToQueryString(route.route.legs[0].maneuvers)
    for(let query of queries){
      const cityResponse = await axios.get(`https://www.mapquestapi.com/geocoding/v1/batch?key=${mapQuestKey}${query}`)
      const cityList = cityResponse.data.results
      for(let city of cityList){
        let cityName = city.locations[0].adminArea4
        if(cityRoute.indexOf(cityName)<0)
          cityRoute.push(cityName)
      }
    }
    delete route.route.legs
    delete route.route.locations
    delete route.route.options
    delete route.info
    route.cityRoute = cityRoute
    res.json({
      status: 200,
      message: "OK",
      data: route
    })
})
function removeCityPrefix(cityName) {
    const prefixes = ['Tỉnh', 'Thành phố'];
    const pattern = new RegExp('^(' + prefixes.join('|') + ')\\s*', 'i');
    const cleanedName = cityName.replace(pattern, '');
    return cleanedName;
}

function splitLocationsToQueryString(locations) {
  const result = [];
  const chunkSize = 99;
  for (let i = 0; i < locations.length; i += chunkSize) {
    const chunk = locations.slice(i, i + chunkSize);
    const queryString = chunk
      .map(location => `&location=${location.startPoint.lat},${location.startPoint.lng}`)
      .join("");

    result.push(queryString);
  }
  return result;
}
export default Router;