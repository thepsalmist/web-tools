import ReactGA from 'react-ga';
import { setAppName, setVersion, APP_TOOLS } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/toolsRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

ReactGA.initialize('UA-60744513-9');

setVersion('3.4.0');

setAppName(APP_TOOLS);

setAppColors({
  light: 'rgb(189,189,189)',
  dark: 'rgb(97,97,97)',
  darker: 'rgb(33,33,33)',
});

initializeApp(routes);
