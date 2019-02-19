$(document).ready(() => {
  const hn = window.location.hostname;
  if (
    hn.indexOf("pier1.com") > 0 ||
    hn.indexOf("pier1.ca") > 0 ||
    hn.indexOf("pier1.demandware.net") > 0
  ) {
    if ($("#device-switcher").length === 0) {
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
  pointer-events: none;
  }
  #device-switcher button:hover {
  color: rgba(0,0,0,0.9);
  background: white;
  border-radius: 2px;
  }
  #recentlyviewed_rr {
  display: none;
  visibility: hidden;
  }
  </style>
  <aside id="device-switcher" style="position: fixed; left: 0; top: 0; z-index: 9999">
  <h2>View This Page On</h2>
  <ul>
  <li><button data-device="desktop">Desktop</button></li>
  <li><button data-device="tablet">Tablet</button></li>
  <li><button data-device="mobile">Mobile</button></li>
  <li><button data-device="side-by-side">Side-by-Side</button></li>
  </ul>
  </aside>`;

      $(document.body).append(html);

      const $body = $("body");
      let currentDeviceType;

      if ($body.hasClass("desktop")) {
        currentDeviceType = "desktop";
      } else if ($body.hasClass("mobile")) {
        currentDeviceType = "mobile";
      } else if ($body.hasClass("tablet")) {
        currentDeviceType = "tablet";
      } else {
        currentDeviceType = "side-by-side";
      }

      $(`#device-switcher button[data-device=${currentDeviceType}]`).addClass(
        "current"
      );

      $("#device-switcher button").click(e => {
        const device = $(e.target).attr("data-device");

        if (device === "side-by-side") {
          $("#device-switcher button").removeClass("current");
          launchSideBySide();
          $('#device-switcher button[data-device="side-by-side"]').addClass(
            "current"
          );
        } else {
          let search = new URLSearchParams(window.location.search);
          search.set("device", device);
          window.location.search = "?" + search.toString();
        }
      });
    } else {
      $("#device-switcher").toggleClass("hidden");
    }
  }

  const launchSideBySide = () => {
    $("#rn_ConditionalChatContainer_1, #m-chat-bubble").hide();
    $("body > .main").css({
      width: "1280px",
      "transform-origin": "top left",
      transition: "transform 0.6s ease-in-out"
    });

    let scaleRatio = parseFloat(($(window).width() - 375) / 1280).toFixed(4);
    if (scaleRatio < 1) {
      $("body > .main").css({
        transform: `scale(${scaleRatio})`
      });
    }

    let newSearch;

    const hasSearch = !!window.location.search;
    const hasHash = !!window.location.hash;

    if (hasSearch) {
      // If it has a search, replace or add to it
      const re = /([?&]device=)([^?&#]+)/;
      if (window.location.search.match(re) !== null) {
        newSearch = window.location.search.replace(re, "$1mobile");
      } else {
        const operand = window.location.search.length > 0 ? "&" : "?";
        newSearch = window.location.search.concat(operand + "device=mobile");
      }
    } else {
      newSearch = "?device=mobile";
    }

    let mobileUri;
    if (hasSearch) {
      mobileUri = window.location.href.replace(
        window.location.search,
        newSearch
      );
    } else if (hasHash) {
      const i = window.location.href.lastIndexOf("#");
      mobileUri =
        window.location.href.substring(0, i) +
        newSearch +
        window.location.href.substring(i);
    } else {
      mobileUri = (mobileUri || "").concat(newSearch);
    }

    const initialDevice = $.cookie("deviceOverride");

    $("body").append('<iframe id="mobile-site" src="' + mobileUri + '" />');
    $("#mobile-site").css({
      border: "0px",
      position: "fixed",
      top: "0",
      right: "0",
      bottom: "0",
      height: "100%",
      width: "375px"
    });

    const cw = window.frames["mobile-site"].contentWindow;

    $("#mobile-site").on("load", () => {
      $.cookie("deviceOverride", initialDevice, { path: "/" });
      cw.$("body").append(
        `<style>
          body { scroll-behavior: smooth; }
          #rn_ConditionalChatContainer_1, #m-chat-bubble { display: none; visibility: hidden; }
        </style>`
      );

      // $('#mobile-site').
    });

    $(window).on("scroll", () => {
      const $main = $("body > .main");

      scaleRatio = parseFloat(($(window).width() - 375) / 1280).toFixed(4);
      const s = $(window).scrollTop(),
        d = parseFloat(
          ($main.height() -
            $("#footer").height() -
            $("header.header").height()) *
            scaleRatio
        ).toFixed(2),
        c = $(window).height();
      const scrollPercent = (s / (d - c)).toFixed(3) * 1;
      const childHeight =
        cw.$(".main").height() -
        cw.$("#footer").height() -
        cw.$(".html-slot-hps-mobile-categories").height() -
        $("header.header").height();
      window.frames["mobile-site"].contentWindow.scrollTo(
        0,
        childHeight * scrollPercent
      );
    });

    (function() {
      var throttle = function(type, name, obj_) {
        var obj = obj_ || window;
        var running = false;
        var func = function() {
          if (running) {
            return;
          }
          running = true;
          requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };

      /* init - you can init any event */
      throttle("resize", "optimizedResize");
    })();

    // handle event
    window.addEventListener("optimizedResize", function() {
      scaleRatio = parseFloat(($(window).width() - 375) / 1280).toFixed(4);
      if (scaleRatio < 1) {
        $("body > .main").css({
          transform: `scale(${scaleRatio})`
        });
      }
    });
  };
});
