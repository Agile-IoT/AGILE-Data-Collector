var solid = require('solid-client')

global.collector = {
  data: null,

  // Replace with API call.
  collect: function() {
    fetch('https://d.databox.me/profile/card', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'text/turtle',
        Accept: 'text/turtle;q=0.8,*/*;q=0.5'
      }
    }).then(function (res) {
      console.log(res)
      return res.text()
    }).then(function (ans) {
      data = ans
    })
  },
    
  upload: function() {
    console.log(this.data)
    console.log(data)
    fetch('https://pre.webid.jolocom.de/profile/file', {
      method: 'PUT',
      credentials: 'include',
      body: data,
      headers: {
        'Content-Type': 'text/turtle',
        Accept: 'text/turtle;q=0.8,*/*;q=0.5',
      }
    })
  }
}
