// server.js 
import app from './app.js'
import { environment } from './config/environment.js'

const port = environment.server.port

app.listen(port, () => {
  console.log(`server is running on http:localhost${port}`)
})  
  