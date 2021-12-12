
import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import {Box, Grid,} from '@material-ui/core';
import Controls from "../controls/Controls";
import { useForm, Form } from "../useForm";
import * as OptionUtils from "../../services/OptionUtils";
import {getAddressItems, getCountryList, getEthnicity, getRace} from "../../services/OptionUtils";

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

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'medicationName',
        headerName: 'Medication Namne',
        width: 200,
        editable: false,
    },
    {
        field: 'medicationValue',
        headerName: 'Value',
        width: 150,
        editable: false,
    },
    {
        field: 'medicationUnit',
        headerName: 'Unit',
        type: 'number',
        width: 110,
        editable: false,
    },
    {
        field: 'medicationPerformer',
        headerName: 'Performer',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
    },
    {
        field: 'medicationRequestDate',
        headerName: 'Prescription Date',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
];

export default function MedicationRequests() {

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
            resetForm()
        }
    }
    return (
        <div className="demography">
            <h1 className="demographyTitle">Patient Medication Requests</h1>
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
                        <Controls.Select
                            name="medicationName"
                            label="Medication Name"
                            value={values.medicationName}
                            onChange={handleInputChange}
                            options={OptionUtils.getCountryList()}
                            error={errors.medicationName}
                        />

                    </Grid>
                    <Grid item xs={6}>
                        <Controls.Input
                            label="Medication Reason"
                            name="medicationReason"
                            value={values.medicationReason}
                            onChange={handleInputChange}
                        />

                    </Grid>

                    <Grid item xs={3}>
                        <Controls.Input
                            label="Dosages"
                            name="dosages"
                            value={values.dosages}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controls.Select
                            name="dosagesUnit"
                            label="Select Unit"
                            value={values.dosagesUnit}
                            onChange={handleInputChange}
                            options={OptionUtils.getCountryList()}
                            error={errors.dosagesUnit}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controls.Input
                            label="Frequency"
                            name="doseFrequency"
                            value={values.doseFrequency}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controls.Select
                            name="doseFrequency"
                            label="Select Unit"
                            value={values.doseFrequency}
                            onChange={handleInputChange}
                            options={OptionUtils.getCountryList()}
                            error={errors.doseFrequency}
                        />
                    </Grid>





                    <Grid item xs={6}>
                        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
                            <Grid item xs={12}>
                                <Controls.Input
                                    label="Performer"
                                    name="performer"
                                    value={values.performer}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={1} columnSpacing={{ xs: 1}}>
                            <Grid item xs={6}>
                                <Controls.DatePicker
                                    name="dateOfPrescription"
                                    label="Date Of Prescription"
                                    value={values.dateOfPrescription}
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
                                text="Add Medication Requests" />
                            <Controls.Button
                                text="Reset"
                                color="default"
                                onClick={resetForm} />
                        </div>
                    </Grid>
                </Grid>
            </Form>
            <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>

    );
}
