
import "./home.css";
import { userData } from "../../dummyData";

import PatientProfile from "../../components/patientProfile/patientProfile";
// FHIR Context Provider
// import FhirClientProvider from "../../services/FhirClientProvider";
import {ClientContext} from "../../services/ClientContext";
import FHIR from "fhirclient"
import {PatientContext} from "../../services/PatientContext";
import * as React from "react";
//
// const client = FHIR.client("https://r4.smarthealthit.org");
//
// // var mkFhir = require('fhirclient');
// // const client = mkFhir.client("https://r3.smarthealthit.org");
// client.request("Patient").then(console.log).catch(console.error);


const client = FHIR.client("https://r4.smarthealthit.org");


export default function Home() {
    const [patientIdContext, setPatientIdContext] = React.useState(null);
      return (
        <div className="home">
          {/*<FeaturedInfo />*/}
          {/*<Chart data={userData} title="User Analytics" grid dataKey="Active User"/>*/}
          {/*<div className="homeWidgets">*/}
          {/*  <WidgetSm/>*/}
          {/*  <WidgetLg/>*/}
          {/*</div>*/}
            <PatientContext.Provider value={{patientIdContext, setPatientIdContext}}>
                <PatientProfile data={userData} title="Patient Profile" grid dataKey="Active User"/>
            </PatientContext.Provider>
        </div>
      );
}
