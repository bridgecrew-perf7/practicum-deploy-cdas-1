import "./patientProfile.css";

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Demography from "../patientDemography/Demography";
import VitalSigns from "../patientVitalSigns/VitalSigns";
import MedicationRequests from "../patientMedications/MedicationRequests";
import {useContext} from "react";
import {ClientContext} from "../../services/ClientContext";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function PatientProfile({ title, data, dataKey, grid }) {
    // const ctx = useContext(ClientContext);
    // console.log(ctx)

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="chart">
            <h3 className="chartTitle">{title}</h3>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Patient Deatils" {...a11yProps(0)} />
                        <Tab label="Vital Signs" {...a11yProps(1)} />
                        <Tab label="Medications" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Demography />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <VitalSigns />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <MedicationRequests />
                </TabPanel>
            </Box>
        </div>
    );
}


