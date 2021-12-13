
import React, {useState, useEffect, useContext} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import {Box, Grid,} from '@material-ui/core';
import Controls from "../controls/Controls";
import { useForm, Form } from "../useForm";
import * as OptionUtils from "../../services/OptionUtils";
import {getAddressItems, getCountryList, getEthnicity, getRace} from "../../services/OptionUtils";
import {PatientContext} from "../../services/PatientContext";
import FHIR from "fhirclient";
import { ObservationTable } from 'fhir-ui'

const client = FHIR.client("https://r4.smarthealthit.org");

const vsBloodPressure = {
    "resourceType": "Observation",
    "category": [ {
        "coding": [ {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "vital-signs",
            "display": "vital-signs"
        } ]
    } ],
    "code": {
        "coding": [ {
            "system": "http://loinc.org",
            "code": "55284-4",
            "display": "Blood Pressure"
        } ],
        "text": "Blood Pressure"
    },
    "subject": {
        "reference": "Patient/1367758"
    },
    "effectiveDateTime": "2021-12-12",
    "component": [ {
        "code": {
            "coding": [ {
                "system": "http://loinc.org",
                "code": "8462-4",
                "display": "Diastolic Blood Pressure"
            } ],
            "text": "Diastolic Blood Pressure"
        },
        "valueQuantity": {
            "value": 106.54543096712958,
            "unit": "mm[Hg]",
            "system": "http://unitsofmeasure.org",
            "code": "mm[Hg]"
        }
    }, {
        "code": {
            "coding": [ {
                "system": "http://loinc.org",
                "code": "8480-6",
                "display": "Systolic Blood Pressure"
            } ],
            "text": "Systolic Blood Pressure"
        },
        "valueQuantity": {
            "value": 181.77258447921758,
            "unit": "mm[Hg]",
            "system": "http://unitsofmeasure.org",
            "code": "mm[Hg]"
        }
    } ]
}

const vsRespiratoryRate = {
    "resourceType": "Observation",
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "vital-signs",
                    "display": "Vital Signs"
                }
            ],
            "text": "Vital Signs"
        }
    ],
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "9279-1",
                "display": "Respiratory rate"
            }
        ],
        "text": "Respiratory rate"
    },
    "subject": {
        "reference": "Patient/example"
    },
    "effectiveDateTime": "1999-07-02",
    "valueQuantity": {
        "value": 26,
        "unit": "breaths/minute",
        "system": "http://unitsofmeasure.org",
        "code": "/min"
    }
}

const vsBodyWeight = {
    "resourceType": "Observation",
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "vital-signs",
                    "display": "Vital Signs"
                }
            ]
        }
    ],
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "29463-7",
                "display": "Body Weight"
            },
            {
                "system": "http://loinc.org",
                "code": "3141-9",
                "display": "Body weight Measured"
            },
            {
                "system": "http://snomed.info/sct",
                "code": "27113001",
                "display": "Body weight"
            },
            {
                "system": "http://acme.org/devices/clinical-codes",
                "code": "body-weight",
                "display": "Body Weight"
            }
        ]
    },
    "subject": {
        "reference": "Patient/example"
    },
    "effectiveDateTime": "2016-03-28",
    "valueQuantity": {
        "value": 185,
        "unit": "lbs",
        "system": "http://unitsofmeasure.org",
        "code": "[lb_av]"
    }
}

const vsHeartBeat = {
    "resourceType": "Observation",
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "vital-signs",
                    "display": "Vital Signs"
                }
            ],
            "text": "Vital Signs"
        }
    ],
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "8867-4",
                "display": "Heart rate"
            }
        ],
        "text": "Heart rate"
    },
    "subject": {
        "reference": "Patient/example"
    },
    "effectiveDateTime": "1999-07-02",
    "valueQuantity": {
        "value": 44,
        "unit": "beats/minute",
        "system": "http://unitsofmeasure.org",
        "code": "/min"
    }
}

const vsOxygenSaturation = {
    "resourceType": "Observation",
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "vital-signs",
                    "display": "Vital Signs"
                }
            ],
            "text": "Vital Signs"
        }
    ],
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "2708-6",
                "display": "Oxygen saturation in Arterial blood"
            },
            {
                "system": "http://loinc.org",
                "code": "59408-5",
                "display": "Oxygen saturation in Arterial blood by Pulse oximetry"
            },
            {
                "system": "urn:iso:std:iso:11073:10101",
                "code": "150456",
                "display": "MDC_PULS_OXIM_SAT_O2"
            }
        ]
    },
    "subject": {
        "reference": "Patient/example"
    },
    "effectiveDateTime": "2014-12-05T09:30:10+01:00",
    "valueQuantity": {
        "value": 95,
        "unit": "%",
        "system": "http://unitsofmeasure.org",
        "code": "%"
    },
    "interpretation": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                    "code": "N",
                    "display": "Normal"
                }
            ],
            "text": "Normal (applies to non-numeric results)"
        }
    ],
    "referenceRange": [
        {
            "low": {
                "value": 90,
                "unit": "%",
                "system": "http://unitsofmeasure.org",
                "code": "%"
            },
            "high": {
                "value": 99,
                "unit": "%",
                "system": "http://unitsofmeasure.org",
                "code": "%"
            }
        }
    ]
}

const vsBodyemprature= {
    "resourceType": "Observation",
    "category": [
        {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "vital-signs",
                    "display": "Vital Signs"
                }
            ],
            "text": "Vital Signs"
        }
    ],
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "8310-5",
                "display": "Body temperature"
            }
        ],
        "text": "Body temperature"
    },
    "subject": {
        "reference": "Patient/example"
    },
    "effectiveDateTime": "1999-07-02",
    "valueQuantity": {
        "value": 36.5,
        "unit": "C",
        "system": "http://unitsofmeasure.org",
        "code": "Cel"
    }
}

const initialFValues = {
    patientID: '',
    respiratoryRate: '',
    respiratoryUnit: '',
    oxygenSaturation: '',
    oxygenSaturationUnit: '',
    bodyWeight: '',
    bodyWeightUnit: '',
    heartRate: '',
    heartRateUnit: '',
    bodyTemprature: '',
    bodyTempratureUnit: '',
    sysBloodPressure: '',
    sysBloodPressureUnit: '',
    diaBloodPressure: '',
    diaBloodPressureUnit: '',
    dateOfObservation: new Date()
}

const columns = [
    {
        field: 'observationType',
        headerName: 'Observation Type',
        width: 200,
        editable: false,
    },
    {
        field: 'observationValue',
        headerName: 'Value',
        width: 150,
        editable: false,
    },
    {
        field: 'observationUnit',
        headerName: 'Unit',
        type: 'number',
        width: 110,
        editable: false,
    },
    {
        field: 'observationDate',
        headerName: 'Recorded Date',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
    },
];

const rows = [
    { observationType: 'Snow', observationValue: 'Jon', observationUnit: 35, observationDate: '' },
    // { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
];

export default function VitalSigns() {
    const { patientIdContext, setPatientIdContext } = useContext(PatientContext);
    const [gridData, setGridData] = useState(null);
    const [gridDataRefresh, setGridDataRefresh] = useState(null);
    //console.log(patientIdContext);
    //setGridData(rows);


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

    initialFValues.patientID = patientIdContext;

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    useEffect(() => {
        var observationObj = null;
        // get observation resoruce values
        // you will need to update the below to retrive the weight and height values
        var query = new URLSearchParams();

        query.set("patient", '7461384e-130e-4fb8-a4ba-c0c80fee3f7a');
        query.set("_count", 100);
        query.set("_sort", "-date");
        // query.set("code", [
        //     'http://loinc.org|8462-4',
        //     'http://loinc.org|8480-6',
        //     'http://loinc.org|2085-9',
        //     'http://loinc.org|2089-1',
        //     'http://loinc.org|55284-4',
        //     'http://loinc.org|3141-9',  // Body weight Measured
        //     'http://loinc.org|29463-7',  // Body weight
        //     'http://loinc.org|8302-2', // Body height
        // ].join(","));

        client.request("Observation?" + query, {
            pageLimit: 0,
            flat: true
        }).then(
            function(ob) {
                setGridData(ob);
                console.log(JSON.stringify(ob));
                console.log(gridData)
                // ob.forEach(function(observation) {
                //     var BP = observation.component.find(function(component) {
                //         return component.code.coding.find(function(coding) {
                //             return coding.code == '8480-6';
                //         });
                //     });
                //     if (BP) {
                //         console.log(BP.valueQuantity);
                //
                //     }
                // });

                // var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
                // var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
                // var hdl = byCodes('2085-9');
                // var ldl = byCodes('2089-1');

            });
    }, [gridDataRefresh])

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()){
            // employeeService.insertEmployee(values)
            console.log(values)
            // Blood pressure
            vsBloodPressure.subject.reference = 'Patient/' + patientIdContext
            vsBloodPressure.effectiveDateTime = values.dateOfObservation
            vsBloodPressure.component[0]['valueQuantity']['value'] = values.diaBloodPressure
            vsBloodPressure.component[1]['valueQuantity']['value'] = values.sysBloodPressure
            console.log(vsBloodPressure)
            client.create(vsBloodPressure).then(
                function(resObj) {
                    console.log(resObj);
                }).catch(console.error);

            // Respiratory rate
            vsRespiratoryRate.subject.reference = 'Patient/' + patientIdContext
            vsRespiratoryRate.effectiveDateTime = values.dateOfObservation
            vsRespiratoryRate.valueQuantity.value = values.respiratoryRate
            console.log(vsRespiratoryRate)
            client.create(vsRespiratoryRate).then(
                function(resObj) {
                    console.log(resObj);
                }).catch(console.error);

            // Heart rate
            vsHeartBeat.subject.reference = 'Patient/' + patientIdContext
            vsHeartBeat.effectiveDateTime = values.dateOfObservation
            vsHeartBeat.valueQuantity.value = values.heartRate
            console.log(vsHeartBeat)
            client.create(vsHeartBeat).then(
                function(resObj) {
                    console.log(resObj);
                }).catch(console.error);

            // Oxygen rate
            vsOxygenSaturation.subject.reference = 'Patient/' + patientIdContext
            vsOxygenSaturation.effectiveDateTime = values.dateOfObservation
            vsOxygenSaturation.valueQuantity.value = values.oxygenSaturation
            console.log(vsOxygenSaturation)
            client.create(vsOxygenSaturation).then(
                function(resObj) {
                    console.log(resObj);
                }).catch(console.error);

            // Body Temprature
            vsBodyemprature.subject.reference = 'Patient/' + patientIdContext
            vsBodyemprature.effectiveDateTime = values.dateOfObservation
            vsBodyemprature.valueQuantity.value = values.bodyTemprature
            console.log(vsBodyemprature)
            client.create(vsBodyemprature).then(
                function(resObj) {
                    console.log(resObj);
                }).catch(console.error);

            // Body Weight
            vsBodyWeight.subject.reference = 'Patient/' + patientIdContext
            vsBodyWeight.effectiveDateTime = values.dateOfObservation
            vsBodyWeight.valueQuantity.value = values.bodyWeight
            console.log(vsBodyWeight)
            client.create(vsBodyWeight).then(
                function(resObj) {
                    console.log(resObj);
                }).catch(console.error);

            resetForm()
            initialFValues.patientID = patientIdContext;
            setValues(initialFValues)
            // gridDataRefresh, setGridDataRefresh
            setGridDataRefresh(1)
        }
    }

    return (
        <div className="demography">
            <h1 className="demographyTitle">Patient Vital Signs</h1>
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
                        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Respiratory rate"
                                    name="respiratoryRate"
                                    value={values.respiratoryRate}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="respiratoryUnit"
                                    label="Select Unit"
                                    value={values.respiratoryUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getRespiratoryUnit()}
                                    error={errors.respiratoryUnit}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Oxygen Saturation"
                                    name="oxygenSaturation"
                                    value={values.oxygenSaturation}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="oxygenSaturationUnit"
                                    label="Select Unit"
                                    value={values.oxygenSaturationUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getOxygenRateUnit()}
                                    error={errors.oxygenSaturationUnit}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Body Weight"
                                    name="bodyWeight"
                                    value={values.bodyWeight}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="bodyWeightUnit"
                                    label="Select Unit"
                                    value={values.bodyWeightUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getBodyWeightUnit()}
                                    error={errors.bodyWeightUnit}
                                />
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Heart Rate"
                                    name="heartRate"
                                    value={values.heartRate}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="heartRateUnit"
                                    label="Select Unit"
                                    value={values.heartRateUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getHeartRateUnit()}
                                    error={errors.heartRateUnit}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Body Temprature"
                                    name="bodyTemprature"
                                    value={values.bodyTemprature}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="bodyTempratureUnit"
                                    label="Select Unit"
                                    value={values.bodyTempratureUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getTempratureUnit()}
                                    error={errors.bodyTempratureUnit}
                                />
                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Systolic blood pressure"
                                    name="sysBloodPressure"
                                    value={values.sysBloodPressure}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="sysBloodPressureUnit"
                                    label="Select Unit"
                                    value={values.sysBloodPressureUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getBlodPressureUnit()}
                                    error={errors.sysBloodPressureUnit}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Diastolic blood pressure"
                                    name="diaBloodPressure"
                                    value={values.diaBloodPressure}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="diaBloodPressureUnit"
                                    label="Select Unit"
                                    value={values.diaBloodPressureUnit}
                                    onChange={handleInputChange}
                                    options={OptionUtils.getBlodPressureUnit()}
                                    error={errors.diaBloodPressureUnit}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
                            <Grid item xs={6}>
                                <Controls.DatePicker
                                    name="dateOfObservation"
                                    label="Date Of Observation"
                                    value={values.dateOfObservation}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                            <Grid item xs={6}>

                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <div>
                            <Controls.Button
                                type="submit"
                                text="Add Vital Signs" />
                            <Controls.Button
                                text="Reset"
                                color="default"
                                onClick={resetForm} />
                        </div>
                    </Grid>
                </Grid>
            </Form>
            <div style={{ height: 200, width: '100%' }}>
                {/*<DataGrid*/}
                {/*    rows={rows}*/}
                {/*    columns={columns}*/}
                {/*    pageSize={5}*/}
                {/*    rowsPerPageOptions={[5]}*/}
                {/*    checkboxSelection*/}
                {/*    disableSelectionOnClick*/}
                {/*/>*/}
                <ObservationTable
                    observations={gridData}
                    tableTitle="Observation List"
                    tableRowSize="medium"
                    hideDevices={true}
                    hideCheckboxes={true}
                    stickyHeader={true}
                    tableHeight={360}
                />
            </div>
        </div>

    );
}
