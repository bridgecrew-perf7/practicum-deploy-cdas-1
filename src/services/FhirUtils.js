import React, { useState } from 'react';

import {ClientContext} from "../../services/ClientContext";
import FHIR from "fhirclient";

const client = FHIR.client("https://r4.smarthealthit.org");


