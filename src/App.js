import './App.css';
import {MenuItem,FormControl,Select} from "@material-ui/core"
import {useState,useEffect} from 'react'
import InfoBox from './InfoBox';
import Table from './Table'
import {Card,CardContent} from '@material-ui/core'
import {sortData} from './util'
import LineGraph from './LineGraph'
import ReactPlayer from 'react-player';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

function App() {
const [countries,setCountries]=useState([]);
const [country,setCountry]=useState('worldwide');
const [countryInfo,setCountryInfo]=useState({});
const [tableData,setTableData]=useState([]);
useEffect(()=>{
  fetch('https://disease.sh/v3/covid-19/all')
  .then(response => response.json())
  .then(data =>{
    setCountryInfo(data);
  });
},[]);
useEffect(() => {

  const getCountriesData= async()=>{
    await fetch ("https://disease.sh/v3/covid-19/countries")
    .then((response)=> response.json())
    .then((data)=>{
const countries = data.map((country)=>(
  {
    name:country.country,
    value: country.countryInfo.iso3
  }
));

const sortedData= sortData(data);
setTableData(sortedData);
setCountries(countries);


    });

  };
  getCountriesData();
}, [countries]);

const onCountryChange = async (event)=> {
const countryCode=event.target.value;
setCountry(countryCode);

const url= countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
await fetch(url)
.then(response => response.json())
.then(data =>{
  setCountry(countryCode);
 setCountryInfo(data);

})

};

console.log("COUNTRY INFO >>>",countryInfo);


  return (

    <div className="app">
      <div className="app_left">
    <div className="app_header">
   <h1> Covid 19 App </h1>
<FormControl className="app__dropdown">
  <Select
  variant="outlined"
  onChange={onCountryChange}
  value={country}

  >
    <MenuItem value ="worldwide" >Worldwide </MenuItem>
   {
     countries.map((country)=>(
       <MenuItem value ={country.value} >{country.name} </MenuItem>
     ))
   }

  </Select>

</FormControl>

   </div>
   <div className="app_stats">
<InfoBox  title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
<InfoBox  title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
<InfoBox  title=" Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
   </div>
   <div className="player">
  <ReactPlayer url="https://www.youtube.com/watch?v=IT7ghcGy6r0"/>

  </div>
  <div>
  <TwitterTimelineEmbed
  sourceType="profile"
  screenName="WHO"
  options={{height: 1700 }}
/>
  </div>
  </div>

<Card className="app_right">
  <CardContent>
<h2> The number of patients </h2>
<Table countries={tableData}/>
<LineGraph/>
  </CardContent>
  <h2 className="head"> 3 Things to remember</h2>
  <div className="inform">
    <div className="things">

<p className="head"> 1> Go get vaccinated</p>
<img className="image" src="https://image.freepik.com/free-vector/cartoon-coronavirus-vaccine-background_23-2148871017.jpg" alt="1"></img>
</div>
<div className="things">
  <p className="head"> 2> Wear mask outside the home </p>
  <img className="image" src="https://www.cdc.gov/coronavirus/2019-ncov/images/masks/322538_young_man_mask_fitter.jpg" alt="2"></img>
</div>
<div className="things">
<p className="head"> 3> Wash your hands</p>
  <img className="image" src="https://creakyjoints.org/wp-content/uploads/2020/03/0320_Handwash_Infographic-1024x683.jpg" alt="3"></img>
</div>
  </div>
</Card>




  </div>
  );
}

export default App;
