import { combineReducers } from 'redux';
import selected from './selected/selected';
import all from './all';
import geo from './geo';
import form from './form/form';
import favorited from './favorited';
import featured from './featured';

const collections = combineReducers({
  all,
  geo,
  selected,
  form,
  favorited,
  featured,
});

export default collections;
