import { Route, Routes } from 'react-router-dom';
import { PublicPage } from './router';
import ScrollToTop from './components/OtherComponent/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ScrollToTop />
        <Routes>
          {PublicPage.map((page, index) => {
            const Page = page.component;
            const Layout = page.layout;

            return (
              <Route
                key={index}
                path={page.path}
                element={
                  Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;