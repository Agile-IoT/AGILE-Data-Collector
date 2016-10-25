var request = require('request');
var fs = require('fs');
var program = require('commander'); 

// Makes sure we don't throw error when handling 
// self signed certificates.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

program
  .version('0.0.1')
  .option('-c --cert <path>', 'The client certificate.')
  .option('-k --key <path>', 'The client private key.')
  .option('-t --target <uri>', 'Url of the Solid server where the data will be stored.')
  .option('-s --source <uri>', 'The endpoint from where the data will be taken.')
  .option('-i --interval <sec>', 'The frequency of data pull / uploads.')
  .option('-d --delegate <webId>', 'Use webid delegation, supply the webId of the account you are delegating for.')
  .parse(process.argv);

if (!(program.cert && program.key && program.source && program.target)) {
  console.log('\n Invalid command line arguments. \n')
  program.outputHelp()
  return
}

try {
  const certFile = fs.readFileSync(program.cert, 'utf8')
  const keyFile = fs.readFileSync(program.key, 'utf8')
} catch (e) {
  console.log('Error occured while reading certificate / key files.')
  return
}

const targetUrl = program.target
const sourceUrl = program.source

const options = {
  url: program.source,
  cert: certFile,
  key: keyFile
}

if (program.delegate) {
  options.headers = {
    'On-Behalf-Of': program.delegate
  }
}

// This is the main loop. Fetches data and then uploads it, calls itself in the end.

const fetchData = () => {
  console.log(`Fetching new data from ${options.url}.`)
  request.get(options, (err, res) => {
    if (err) {
      console.log(`Error occured while fetching the data. ${err}`)
      return
    }

    const putOptions = Object.assign({}, options, {
      url: program.target,
      body: res.body
    })

    request.put(putOptions, (err,res) => {
      if (err) {
        console.log(`Error occured while uploading the data. ${err}`)
        return
      }
      console.log(`New data uploaded to ${putOptions.url}.`)
      setTimeout(fetchData, 10000)
    })
  })
}

fetchData()
