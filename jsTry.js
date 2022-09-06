// var u={a:'haskell',b:'ocaml'}
// var {a}=u
// console.log(a)

// var a=new String('zla')
// a[Symbol.iterator]=function* (){
//     yield 'name'
//     yield 'age'
//     yield 'gender'
// }
// console.log([...a])
// class Al{
//     constructor(name){
//         this.name=name
//     }
// }
// Al[Symbol.iterator]=function* (){
//     yield 'name'
//     yield 'age'
//     yield 'gender'
// }
// var zla=new Al('zla')
// zla[Symbol.iterator]=function* (){
//     yield 'name'
//     yield 'age'
//     yield 'gender'
// }
// for(let i of zla){
//     console.log(i)
// }

// var a=[1,2,3]
// var aIterator=a[Symbol.iterator]()
// console.log(aIterator.next())
// var clientSocket=new WebSocket('http://localhost:3000')
// clientSocket.send('i miss u')
// console.log(111)

// var A={
//     age:60
// }
// var age=50
// var me={
//     name:'zla',
//     age:18,
//     tellMe:()=>{
//         console.log(this.age)
//     }}
// me.tellMe()
// console.log(self)

const addResourcesToCache = async (resources) => {
    const cache = await caches.open('v1');
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
  };

const cacheFirst = async ({ request, fallbackUrl }) => {
    // First try to get the resource from the cache
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
  
    // Next try to get the resource from the network
    try {
      const responseFromNetwork = await fetch(request);
      // response may be used only once
      // we need to save clone to put one copy in cache
      // and serve second one
      putInCache(request, responseFromNetwork.clone());
      return responseFromNetwork;
    } catch (error) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
      // when even the fallback response is not available,
      // there is nothing we can do, but we must always
      // return a Response object
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  };

self.addEventListener('install', (event) => {
    event.waitUntil(
      addResourcesToCache([
        '/justCode/socket/pic1.webp',
        '/justCode/socket/try.html',
        '/justCode/socket/jsTry.js',
        ])
    );
});
  
self.addEventListener('fetch', (event) => {
event.respondWith(
    cacheFirst({
    request: event.request,
    preloadResponsePromise: event.preloadResponse,
    fallbackUrl: '/gallery/myLittleVader.jpg',
    })
);
});