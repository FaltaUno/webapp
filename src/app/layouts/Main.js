import Footer from '../components/Footer'
import Header from '../components/Header'
import Meta from '../components/Meta'

export default ({ children }) => (
  <div>
    <Meta />
    <Header />
    {children}
    <Footer />
  </div>
)
