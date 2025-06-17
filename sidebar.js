const state = {
    tokens: [],
    selectedToken: null,
  
    initJupiter() {
      if (!window.jupiterLoaded) {
        const script = document.createElement('script');
        script.src = browser.runtime.getURL('main-v4.js');
        script.onload = () => {
          window.jupiterLoaded = true;
          this.startJupiter();
        };
        document.body.appendChild(script);
      } else {
        this.startJupiter();
      }
    },
  
    startJupiter() {
      if (window.Jupiter.init && !document.getElementById('jupiter-terminal').children.length) {
        window.Jupiter.init({
          containerProps: { style: { width: '100%' } },
          formProps: {
            initialInputMint: 'So11111111111111111111111111111111111111112', // USDC по умолчанию
            initialOutputMint: 'So11111111111111111111111111111111111111112' // USDC
          }
        });
      }
    },
  
    updateJupiter(inputMint) {
      if (window.jupiterLoaded && window.Jupiter.updateForm) {
        window.Jupiter.updateForm({
          inputMint,
          outputMint: 'So11111111111111111111111111111111111111112' // USDC
        });
      }
    },
  
    findTokensInText(text) {
      return [...new Set(text.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g) || [])];
    },
  
    extractTokensFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenAddress = urlParams.get("token");
      if (tokenAddress && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(tokenAddress)) {
        state.tokens.push({ address: tokenAddress, name: 'Token from URL' });
        this.updateJupiter(tokenAddress);
      }
    },
  
    scanPageForTokens() {
      const text = document.body.innerText;
      const addresses = this.findTokensInText(text);
  
      addresses.forEach(addr => {
        if (!state.tokens.some(t => t.address === addr)) {
          fetch(`https://api.jup.ag/tokens/${addr}`).then(res  => res.json())
            .then(data => {
              state.tokens.push({ address: addr, name: data.symbol || 'Unknown' });
              m.redraw();
            })
            .catch(() => {
              state.tokens.push({ address: addr, name: 'Unknown' });
              m.redraw();
            });
        }
      });
  
      document.querySelectorAll('*').forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          addresses.forEach(addr => {
            if (node.textContent.includes(addr)) {
              const icon = document.createElement('span');
              icon.textContent = '💱';
              icon.title = 'Обменять токен';
              icon.style.cssText = `
                position: absolute;
                top: 0;
                right: -25px;
                cursor: pointer;
                font-size: 16px;
                background: #fff;
                border-radius: 50%;
                padding: 4px;
                box-shadow: 0 0 5px rgba(0,0,0,0.2);
                z-index: 100000;
              `;
              icon.onclick = () => state.updateJupiter(addr);
  
              const wrapper = document.createElement('div');
              wrapper.style.position = 'relative';
              wrapper.style.display = 'inline-block';
  
              const span = document.createElement('span');
              span.textContent = node.textContent;
              node.replaceWith(span);
              wrapper.appendChild(span);
              wrapper.appendChild(icon);
  
              span.parentNode.insertBefore(wrapper, span.nextSibling);
            }
          });
        }
      });
    }
  };
  
  // Инициализация
  state.extractTokensFromURL();
  state.scanPageForTokens();
  state.initJupiter();
  
  // UI с Mithril
  m.mount(document.getElementById("app"), {
    view: () =>
      m("div", [
        m("h3", "Обмен токенами"),
        m("div#jupiter-terminal", "Загрузка Jupiter Terminal..."),
        m("hr"),
        m("h3", "Найденные токены"),
        m("div", state.tokens.map(token =>
          m("div.token-item", {
            onclick: () => state.updateJupiter(token.address)
          }, `${token.name} (${token.address.slice(0, 6)}...)`)
        ))
      ])
  });