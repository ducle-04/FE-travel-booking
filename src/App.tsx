import { Route, Routes } from 'react-router-dom';
import { PublicPage } from './router';
import ScrollToTop from './components/OtherComponent/ScrollToTop';


function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {PublicPage.map((page, index) => {
          console.log(page);
          const Page = page.component;
          const Layout = page.layout;

          if (!Layout) {
            return (
              <Route
                key={index}
                path={page.path}
                element={<Page />}
              />
            );
          } else {
            return (
              <Route
                key={index}
                path={page.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          }
        })}
      </Routes>
    </div>
  );
}

export default App;
