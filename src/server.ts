import app from "./app";
import config from "./config";
import { initDb } from "./db";


const main = () => {
  initDb()
  app.listen(config.port, () => {
    console.log(`DevPulse server is runnig at port http://localhost:${config.port}`);
  })
}

main()