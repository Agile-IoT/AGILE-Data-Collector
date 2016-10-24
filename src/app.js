global.collector = {
  data: null,

  // Replace with API call.
  collect: function() {
    const url = document.getElementById('endpointuri').value
    fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'text/turtle',
        Accept: 'text/turtle;q=0.8,*/*;q=0.5'
      }
    }).then(function (res) {
      return res.text()
    }).then(function (ans) {
      data = ans
    })
  },
  
  readData: function() {
    const url = document.getElementById('solidUri').value
    fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'text/turtle;q=0.8,*/*;q=0.5'
      }
    }).then((response) => {
      return response.text()
    }).then((text) => {
      alert(text)
    })
  },
    
  upload: function() {
    const url = document.getElementById('solidUri').value
    fetch(url, {
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
