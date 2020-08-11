import { builtinModules } from 'module';

import firebase from 'firebase';
import config from './config';

export const firebaseApp = firebase.initializeApp(config);
export const firestore = firebase.firestore();
export const functions = firebase.functions();
