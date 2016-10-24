var request = require('request');
var fs = require('fs');
var program = require('commander'); 

program
  .version('0.0.1')
  .option('-c --cert <path>', 'The client certificate.')
  .option('-k --key <path>', 'The client private key.')
  .option('-t --target <uri>', 'Url of the Solid server where the data will be stored.')
  .option('-s --source <uri>', 'The endpoint from where the data will be taken.')
  .option('-i --interval <sec>', 'The frequency of data pull / uploads.')
  .parse(process.argv);

if (!(program.cert && program.key && program.source && program.target)) {
  console.log('Invalid command line arguments.')
  return
}

const certFile = fs.readFileSync(program.cert, 'utf8')
const keyFile = fs.readFileSync(program.key, 'utf8')
const targetUrl = program.target
const sourceUrl = program.source

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const options = {
  url: program.source,
  cert: certFile,
  key: keyFile
}

const fetchData = () => {
  console.log('Fetching new data.')
  request.get(options, (err, res) => {
    if (err) {
      console.log(err)
      return
    }
    const putOptions = Object.assign({}, options, {
      url: program.target,
      body: res.body
    }) 

    request.put(putOptions, (err,res) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('New data uploaded.')
      setTimeout(fetchData, 10000)
    })
  })
}

fetchData()
