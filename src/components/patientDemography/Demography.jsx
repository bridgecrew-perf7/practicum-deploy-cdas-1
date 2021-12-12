import "./Demography.css";

import React, {useState, useEffect, useContext} from 'react'
import {Box, Grid,} from '@material-ui/core';
import Controls from "../controls/Controls";
import { useForm, Form } from "../useForm";
import * as OptionUtils from "../../services/OptionUtils";
import {getAddressItems, getCountryList, getEthnicity, getRace} from "../../services/OptionUtils";
import {ClientContext} from "../../services/ClientContext";
import FHIR from "fhirclient"
import {PatientContext} from "../../services/PatientContext";

const client = FHIR.client("https://r4.smarthealthit.org");

const initialFValues = {
  patientID: '',
  ssnNumber: '',
  firstName: '',
  lastName: '',
  race: '',
  ethnicity: '',
  gender: '',
  dateOfBirth: new Date(),
  addressToUse: '',
  homeAddress: '',
  homeCity: '',
  homeState: '',
  homeCountry: '',
  homeZipCode: '',
  officeAddress: '',
  officeCity: '',
  officeState: '',
  officeCountry: '',
  officeZipCode: '',
}

const patientSchema = {
  "resourceType" : "Patient",
  "meta" : {
    "extension" : [
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/instance-name",
        "valueString" : "Patient Example"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/instance-description",
        "valueMarkdown" : "This is a patient example for the *US Core Patient Profile*."
      }
    ],
    "profile" : [
      "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
    ]
  },
  "extension" : [
    {
      "extension" : [
        {
          "url" : "ombCategory",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "2106-3",
            "display" : "White"
          }
        },
        {
          "url" : "ombCategory",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "1002-5",
            "display" : "American Indian or Alaska Native"
          }
        },
        {
          "url" : "ombCategory",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "2028-9",
            "display" : "Asian"
          }
        },
        {
          "url" : "detailed",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "1586-7",
            "display" : "Shoshone"
          }
        },
        {
          "url" : "detailed",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "2036-2",
            "display" : "Filipino"
          }
        },
        {
          "url" : "text",
          "valueString" : "Mixed"
        }
      ],
      "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"
    },
    {
      "extension" : [
        {
          "url" : "ombCategory",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "2135-2",
            "display" : "Hispanic or Latino"
          }
        },
        {
          "url" : "detailed",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "2184-0",
            "display" : "Dominican"
          }
        },
        {
          "url" : "detailed",
          "valueCoding" : {
            "system" : "urn:oid:2.16.840.1.113883.6.238",
            "code" : "2148-5",
            "display" : "Mexican"
          }
        },
        {
          "url" : "text",
          "valueString" : "Hispanic or Latino"
        }
      ],
      "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
    },
    {
      "url" : "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
      "valueCode" : "F"
    }
  ],
  "active" : true,
  "name" : [
    {
      "family" : "Shaw",
      "given" : [
        "Amy"
      ]
    }
  ],
  "gender" : "female",
  "birthDate" : "1987-02-20",
  "address" : [
    {
      "line" : [
        "49 Meadow St"
      ],
      "city" : "Mounds",
      "state" : "OK",
      "postalCode" : "74047",
      "country" : "US"
    }
  ]
};


export default function Demography() {
  const { patientIdContext, setPatientIdContext } = useContext(PatientContext);

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('fullName' in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required."
    if ('email' in fieldValues)
      temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
    if ('mobile' in fieldValues)
      temp.mobile = fieldValues.mobile.length > 9 ? "" : "Minimum 10 numbers required."
    if ('departmentId' in fieldValues)
      temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required."
    setErrors({
      ...temp
    })

    if (fieldValues == values)
      return Object.values(temp).every(x => x == "")
  }

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm(initialFValues, true, validate);



  const handleSubmit = e => {
    e.preventDefault()
    if (validate()){
      // employeeService.insertEmployee(values)
      console.log(values)

      patientSchema.gender = values.gender
      patientSchema.birthDate = values.dateOfBirth
      patientSchema.name[0].family = values.lastName
      patientSchema.name[0].given[0] = values.firstName
      patientSchema.gender = values.gender
      console.log(patientSchema)
      //client.request("Patient").then(console.log).catch(console.error);
      client.create(patientSchema).then(
          function(resObj) {
            console.log(resObj);
            // ldlValue = getQuantityValueAndUnit(resob);
            // console.log(ldlValue)
            // ldl.innerHTML = ldlValue;
            // document.getElementById("ldl").innerHTML = ldlValue;
            setPatientIdContext(resObj.id);
          }).catch(console.error);
      resetForm()

    }
  }
  return (
    <div className="demography">
      <h1 className="demographyTitle">Patient Demography</h1>
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
          <Grid item xs={6}>
            <Controls.Input
                name="patientID"
                label="Patient ID"
                value={values.patientID}
                onChange={handleInputChange}
                error={errors.patientID}
            />
          </Grid>
          <Grid item xs={6}>

          </Grid>
          <Grid item xs={6}>
            <Controls.Input
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
            />
          </Grid>
          <Grid item xs={3}>
            <Controls.DatePicker
                name="dateOfBirth"
                label="Date Of Birth"
                value={values.dateOfBirth}
                onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Controls.Select
                name="race"
                label="Race"
                value={values.race}
                onChange={handleInputChange}
                options={OptionUtils.getRace()}
                error={errors.race}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
                name="lastName"
                label="Last Name"
                value={values.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
            />
          </Grid>
          <Grid item xs={3}>
            <Controls.Select
                name="gender"
                label="Gender"
                value={values.gender}
                onChange={handleInputChange}
                options={OptionUtils.getGender()}
                error={errors.gender}
            />
          </Grid>
          <Grid item xs={3}>
            <Controls.Select
                name="ethnicity"
                label="Ethnicity"
                value={values.ethnicity}
                onChange={handleInputChange}
                options={OptionUtils.getEthnicity()}
                error={errors.ethnicity}
            />
          </Grid>
          <Grid item xs={12}>
            <Controls.RadioGroup
                name="addressToUse"
                label="Address To Use"
                value={values.addressToUse}
                onChange={handleInputChange}
                items={OptionUtils.getAddressItems()}
            />
          </Grid>

          <Grid item xs={6}>
            <Grid container spacing={1} columnSpacing={{ xs: 1}}>
              <Grid item xs={12}>
                  <Controls.Input
                      label="Line street & house number"
                      name="homeAddress"
                      value={values.homeAddress}
                      onChange={handleInputChange}
                  />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                    label="City"
                    name="homeCity"
                    value={values.homeCity}
                    onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                    label="State"
                    name="homeState"
                    value={values.homeState}
                    onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.Select
                    name="homeCountry"
                    label="Country"
                    value={values.homeCountry}
                    onChange={handleInputChange}
                    options={OptionUtils.getCountryList()}
                    error={errors.homeCountry}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                    label="Zip code"
                    name="homeZipCode"
                    value={values.homeZipCode}
                    onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            {/*<Grid container spacing={1} columnSpacing={{ xs: 1}}>*/}
            {/*  <Grid item xs={12}>*/}
            {/*    <Controls.Input*/}
            {/*        label="Office line street & house number"*/}
            {/*        name="officeAddress"*/}
            {/*        value={values.officeAddress}*/}
            {/*        onChange={handleInputChange}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*  <Grid item xs={6}>*/}
            {/*    <Controls.Input*/}
            {/*        label="Office City"*/}
            {/*        name="officeCity"*/}
            {/*        value={values.officeCity}*/}
            {/*        onChange={handleInputChange}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*  <Grid item xs={6}>*/}
            {/*    <Controls.Input*/}
            {/*        label="Office State"*/}
            {/*        name="officeState"*/}
            {/*        value={values.officeState}*/}
            {/*        onChange={handleInputChange}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*  <Grid item xs={6}>*/}
            {/*    <Controls.Select*/}
            {/*        name="officeCountry"*/}
            {/*        label="Office Country"*/}
            {/*        value={values.officeCountry}*/}
            {/*        onChange={handleInputChange}*/}
            {/*        options={OptionUtils.getCountryList()}*/}
            {/*        error={errors.officeCountry}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*  <Grid item xs={6}>*/}
            {/*    <Controls.Input*/}
            {/*        label="Office zip code"*/}
            {/*        name="officeZipCode"*/}
            {/*        value={values.officeZipCode}*/}
            {/*        onChange={handleInputChange}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*</Grid>*/}
          </Grid>

          <Grid item xs={12}>
            <div>
              <Controls.Button
                  type="submit"
                  text="Create or Update" />
              <Controls.Button
                  text="Reset"
                  color="default"
                  onClick={resetForm} />
            </div>
          </Grid>
        </Grid>
      </Form>
    </div>

  );
}
