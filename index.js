$(document).ready(() => {
  if (window.location.hostname.indexOf('pier1.com') > 0 ||
      window.location.hostname.indexOf('pier1.demandware.net') > 0) {
      if ($('#device-switcher').length === 0) {
          const html = `
<style>
#device-switcher {
position: fixed;
margin: 1rem;
padding: 0.5rem;
z-index: 99999;
background: rgba(0,0,0,0.9);
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.23), -2px -2px 2px rgba(0, 0, 0, 0.04);
}
#device-switcher h2 {
color: white;
font-weight: 400;
text-align: center;
font-size: 1rem;
}
#device-switcher ul {
list-style-type: none;
display: inline;
}
#device-switcher li {
display: inline-block;
}
#device-switcher button {
padding: 0.5rem;
}
#device-switcher button.current {
border-bottom: 2px solid white;
}
#device-switcher button:hover {
color: rgba(0,0,0,0.9);
background: white;
border-radius: 2px;
}
</style>
<aside id="device-switcher" style="position: fixed; left: 0; top: 0; z-index: 9999">
<h2>View This Page On</h2>
<ul>
<li><button data-device="desktop">Desktop</button></li>
<li><button data-device="tablet">Tablet</button></li>
<li><button data-device="mobile">Mobile</button></li>
</ul>
</aside>`;

          $(document.body).append(html);

          const $body = $('body');
          let currentDeviceType;

          if ($body.hasClass('desktop')) {
              currentDeviceType = 'desktop';
          } else if ($body.hasClass('mobile')) {
              currentDeviceType = 'mobile';
          } else if ($body.hasClass('tablet')) {
              currentDeviceType = 'tablet';
          }

          $(`#device-switcher button[data-device=${currentDeviceType}]`).addClass('current');

          $('#device-switcher button').click((e) => {
              const device = $(e.target).attr('data-device');
              let search = new URLSearchParams(window.location.search);
              search.set('device', device);
              window.location.search = '?' + search.toString();
          });
      }
  }
});