# Město Ivanssonne

## Developeři
- [Tomáš Kelbasa](https://github.com/TomasKelbasa) - brainstorm professional, fullstack programmer, cybernetic specialist, scratch senior programmer
  <img src="ivanssonne/src/assets/tomas.webp" width="1080px" height="250px" alt="Tomas">
- [Ivan Kraus](https://github.com/KrausIvan) - Browser engine optimizer, react optimizer, memo optimizer, figma specialist, fullstack developer, network engineer, UX & UI designer, copywritter, big data specialist
  <img src="ivanssonne/src/assets/image.png" width="1080px" height="200px" alt="Yvan">

## Téma

Předělávka známé deskové hry [Carcassonne](https://www.zatrolene-hry.cz/spolecenska-hra/carcassonne-8/).
Hra bude pro dva hráče, možná bude možnost hrát i proti počítači.

## Figma design

https://www.figma.com/file/5vMA4hZmWaYrlaBD8ajpZP/Untitled?type=design&node-id=0-1&mode=design&t=TYaw6hWEpXABnzl1-0

### Z čeho čerpat

- interaktivní hra (předělávka "deskovky")
- mohlo by být použitelné jako solitaire
- nebo "AI" protihráč
- inspirovat se můžete na [zatrolených hrách](https://www.zatrolene-hry.cz/katalog-her/?fType=cat&keyword=&theme=-1&category=-1&minlength=-1&maxlength=-1&localization=6%2C+7%2C+8&min_players=1&max_players=1&age=-1)...
- karetní hry méně typické - např. [Kabo](https://www.zatrolene-hry.cz/spolecenska-hra/kabo-8341/)
- učitelem oblíbená [Cartagena](https://www.zatrolene-hry.cz/spolecenska-hra/cartagena-422/) stále čeká na remake

### Techniky

- ✔️ využití localStorage / sessionStorage
- ❌ čtení dat z externího RestAPI (fetch)
- ✔️ operace DnD
- ✔️ využití react-routeru
- ❌ funkčnost na mobilu (výjimka je předělávka komplexních deskových her) (sem určitě spadáme :) )

### Co není obsahem 

- databáze
- bez vlastních backend service
- trapné věci: *klasické karetní hry*, *člověče nezlob se*, ...
