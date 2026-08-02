import app from "./app"
import config from "./config"


const port = config.port || 3000

app.listen(port, () => {
  try {
    console.log(`Example app listening on port ${port}`)
  } catch (error) {
    
  }
})