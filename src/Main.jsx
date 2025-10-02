import { createRoot } from 'react-dom/client'
import './Styles/Index.css'
import App from './App.jsx'
import { store } from './Redux/Store.js'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Tooltip } from 'react-tooltip'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        className={'toastifyCustomClass'}
        closeButton={false}
        limit={5}
        theme="light"
        hideProgressBar={true}
        closeOnClick={true}
      />
      <Tooltip />
    </BrowserRouter>
  </Provider>

)
