import React, { Suspense } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { CContainer, CFade } from '@coreui/react/lib';

// routes config
import routes from '../routes';
import { CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
const arrToShowBackButton = [
  'new',
  'edit',
  'detail',
  'print',
  'report'
]
const TheContent = () => {
  const history = useHistory();

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <CFade>
                        {new RegExp(arrToShowBackButton.join("|")).test(route.path) && <CButton size="sm" className="btn btn-info mb-3" onClick={history.goBack}>
                          <CIcon name="cilArrowLeft" className="mr-3" size={'xl'} />
                          {'Quay lại'}
                        </CButton>
                        }
                        <route.component {...props} />
                      </CFade>
                    )}
                  />
                )
              );
            })}
            {/* <Redirect from="/" to="/dashboard" /> */}
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
