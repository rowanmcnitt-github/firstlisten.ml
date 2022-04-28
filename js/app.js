App = 
{
  web3: null,
  database: null,
  contracts: {},
  address:'0x179896b3A20f2FF40e99243433868388e9cA9112',
  authentication_code: "2-293430-1110672763-iiUQqdsT4U2M5",
  network_id:3, // 5777 for local
  handler:null,
  value:1000000000000000000,
  index:0,
  margin:10,
  left:15,
  user_address: '',
  mappedButtons: [], // this needs to be changed,, like severely lol
  firstTryAdd : true,
  SGPrice: 1400000,
  init: function() 
  {
    return App.initWeb3();
  },
  initFirebase: function()
  {
    const firebaseConfig = {
      apiKey: "AIzaSyBsZdc8C6AN9Zxnt6lt28DRLoPKhTSd7sA",
      authDomain: "firstlisten-c8adb.firebaseapp.com",
      databaseURL: "https://firstlisten-c8adb-default-rtdb.firebaseio.com/",
      projectId: "firstlisten-c8adb",
      storageBucket: "firstlisten-c8adb.appspot.com",
      messagingSenderId: "249499245746",
      appId: "1:249499245746:web:0edb063f608a55158d3dab",
      measurementId: "G-NV49XHRBXG"
    };
    firebase.initializeApp(firebaseConfig); 
    database = firebase.database();
    //
    var ref = database.ref('songs');
    ref.on('value', this.gotData, this.errData);
  },
  initWeb3: async function()
  {
    App.initFirebase();
    //      
    if (typeof web3 !== 'undefined') 
    {
      App.web3 = new Web3(Web3.givenProvider);
    } else 
    {
      App.web3 = new Web3(App.url);
    }
    //
    await ethereum.enable(); // Technically outdated... could be leading to bugs -- ?
    return App.initContract();  
  },
  initContract: function()
  {
    //
    App.contracts.FLContract = new App.web3.eth.Contract(App.abi,App.address, {});
    //
    return App.bindEvents();
  },
  bindEvents: function()
  {
    // $(document).on('click', "#eth_sell_button", function()
    // {
      
    // });
    // document.getElementById('loginSubmitButton').removeEventListener('click');
    // console.log(document.getElementById('loginSubmitButton').attributes);
    //"2-292635-328778223-uNYOvOnCl4C4hk"
    window.addEventListener('click', function(e){
      if (!document.getElementById('myForm').contains(e.target) && !document.getElementById('login_button').contains(e.target)) 
      {
        document.getElementById("myForm").style.display = "none";
      }
    })
    window.addEventListener('click', function(e){
      if (!document.getElementById('buyCoins').contains(e.target) && !document.getElementById('buyFLC').contains(e.target)) 
      {
        document.getElementById("buyCoins").style.display = "none";
      }
    })
    window.addEventListener('click', function(e){
      if (!document.getElementById('uploadForm').contains(e.target) && !document.getElementById('uploadNewSong').contains(e.target)) 
      {
        document.getElementById("uploadForm").style.display = "none";
      }
    })
    // loginAuthCode" placeholder="Enter Authentication Token" name="SCauth" required>
              // <button type="submit" class="btn login" id="loginSubmitButton">Login<
    $(document).on('click', '#loginSubmitButton', async function()
    {
       //check this *later lol * llolol
       document.getElementById("myForm").style.display = "none";
       App.startLoad();
       await App.sleep(200);
       var PJF = "";
       var resp = await App.verifyLogin(jQuery("#loginAuthCode").val()).then(function (r){PJF = r;});
       if(PJF.status == "verified")
       {
         console.log("Successfully logged in.");
        //  console.log(resp);
         App.successLoad();
       }
       else
       {
         console.log("Failed to login.");
         App.endLoad();
       }
    });
    $(document).on('click', '#logoutButton', async function()
    {
       //check this *later lol * llolol
       App.startLoad();
       await App.sleep(100);
       App.authentication_code = "2-292635-328778223-uNYOvOnCl4C4hk";
       App.successLoad();
    });
    $(document).on('click', '#uploadButton', function()
    {
      if(App.embedToKey(jQuery('#addEmbed').val()) == false){alert('Must be a privated track.'); return false;}
       App.addSong(jQuery('#uploadCost').val(), App.embedToID(jQuery('#addEmbed').val()), App.embedToKey(jQuery('#addEmbed').val())); // change the #Initialize later
       document.getElementById('uploadCost').value = '';
       document.getElementById('addEmbed').value = '';
       document.getElementById("uploadForm").style.display = "none";
    });
    $(document).on('click', '#buyCoinButton', function()
    {
      if(jQuery('#coinQuantity').val() == null){return false;}
      if(jQuery('#coinQuantity').val() <= 0){alert('Must be a positive value.'); return false;}
      //  App.addSong(jQuery('#coinQuantity').val()); // change the #Initialize later
      App.buyCoins(jQuery('#coinQuantity').val());
      document.getElementById('coinQuantity').value = '';
      document.getElementById("buyCoins").style.display = "none";
    });
    $(document).on('click', '#searchSongs', function()
    {
      if(jQuery("#searchText").val() == ""){return;}
      if(document.getElementById("searchIcon").classList.contains('owned'))
      {
        App.listSongs("songsList", 0, jQuery("#searchText").val());
      }
      else if(document.getElementById("searchIcon").classList.contains('listings'))
      {
        App.listSongs("songsList", 2, jQuery("#searchText").val());
      }
      else
      {
       App.listSongs("songsList", 1, jQuery("#searchText").val());
      }
    });
    $('#searchText').keydown(function(e){
      if(e.keyCode === 13)
      {
        if(document.getElementById("searchIcon").classList.contains('owned'))
       {
         App.listSongs("songsList", 0, jQuery("#searchText").val());
       }
       else if(document.getElementById("searchIcon").classList.contains('listings'))
       {
         App.listSongs("songsList", 2, jQuery("#searchText").val());
       }
       else
       {
        App.listSongs("songsList", 1, jQuery("#searchText").val());
       }
      }  
  });
    $(document).on('click', '#login_button', function()
    {
      document.getElementById("myForm").style.display = "block";
    });
    $(document).on('click', '#websiteLogo', function()
    {
      App.finishInitialization();
    });
    $(document).on('click', '#listOwnedSongs', function()
    {
      App.listSongs("songsList", 0);
      document.getElementById("listOwnedSongs").classList.add('active');
      document.getElementById("uploadNewSong").classList.remove('active');
      document.getElementById("listPurchasableSongs").classList.remove('active');
      document.getElementById("searchIcon").classList.add('owned');
      document.getElementById("searchIcon").classList.remove('listings');
      document.getElementById("listListings").classList.remove('active');
      //
      document.getElementById("searchMenu").style.display = "block";
      //
      document.getElementById("buyCoins").style.display = "none";
      document.getElementById("buyFLC").classList.remove('active');
      // $("#listOwnSongs").html('<a class="orange item active" id="listOwnSongs">My Songs</a>');
      // $("#uploadSongsButton").html('<a class="orange item" id = "uploadSongsButton">Upload Songs</a>');
    });
    $(document).on('click', '#listListings', function()
    {
      App.listSongs("songsList", 2);
      document.getElementById("listOwnedSongs").classList.remove('active');
      document.getElementById("uploadNewSong").classList.remove('active');
      document.getElementById("listPurchasableSongs").classList.remove('active');
      document.getElementById("listListings").classList.add('active');
      document.getElementById("searchIcon").classList.add('listings');
      document.getElementById("searchIcon").classList.remove('owned');
      
      //
      document.getElementById("searchMenu").style.display = "block";
      document.getElementById("buyCoins").style.display = "none";
      document.getElementById("buyFLC").classList.remove('active');
      // $("#listOwnSongs").html('<a class="orange item active" id="listOwnSongs">My Songs</a>');
      // $("#uploadSongsButton").html('<a class="orange item" id = "uploadSongsButton">Upload Songs</a>');
    });
    $(document).on('click', '#uploadNewSong', function()
    {
      document.getElementById("listOwnedSongs").classList.remove('active');
      document.getElementById("uploadNewSong").classList.add('active');
      document.getElementById("listPurchasableSongs").classList.remove('active');
      document.getElementById("listListings").classList.remove('active');
      //
      document.getElementById("searchMenu").style.display = "none";
      //
      document.getElementById("uploadForm").style.display = "block";
      //
      document.getElementById("buyCoins").style.display = "none";
      document.getElementById("buyFLC").classList.remove('active');
      // $("#listOwnSongs").html('<a class="orange item" id="listOwnSongs">My Songs</a>');
      // $("#uploadSongsButton").html('<a class="orange item active" id = "uploadSongsButton">Upload Songs</a>');
    });
    $(document).on('click', '#buyFLC', function()
    {
      document.getElementById("listOwnedSongs").classList.remove('active');
      document.getElementById("uploadNewSong").classList.remove('active');
      document.getElementById("listPurchasableSongs").classList.remove('active');
      document.getElementById("listListings").classList.remove('active');
      //
      document.getElementById("searchMenu").style.display = "none";
      //
      document.getElementById("uploadForm").style.display = "block";
      //ADD THIS TO OTHERTHINGS
      document.getElementById("buyCoins").style.display = "block";
      document.getElementById("buyFLC").classList.add('active');
      //
      // $("#listOwnSongs").html('<a class="orange item" id="listOwnSongs">My Songs</a>');
      // $("#uploadSongsButton").html('<a class="orange item active" id = "uploadSongsButton">Upload Songs</a>');
    });
    
    $(document).on('click', '#listPurchasableSongs', function()
    {
      App.listSongs("songsList", 1);
      document.getElementById("listOwnedSongs").classList.remove('active');
      document.getElementById("uploadNewSong").classList.remove('active');
      document.getElementById("listPurchasableSongs").classList.add('active');
      document.getElementById("searchIcon").classList.remove('owned');
      document.getElementById("searchIcon").classList.remove('listings');
      document.getElementById("listListings").classList.remove('active');
      //
      document.getElementById("buyCoins").style.display = "none";
      document.getElementById("buyFLC").classList.remove('active');
      //
      // $("#searchMenu").html('<div class="ui menu" id="searchMenu">');
      document.getElementById("searchMenu").style.display = "block";
    });
    App.populateAddress();
  },
  verifyLogin: async function(authCode)
  {
    App.sleep(200);
    var dat = await App.userData(authCode);
    if(dat == null || dat == undefined){return "";}
    return JSON.parse(dat);
  },
  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  populateAddress : async function(){  
    App.handler = await App.web3.givenProvider.selectedAddress; // this is null -- could be the issue with the getter or some shi (tthat we had before)
    App.user_address = await Web3.utils.toChecksumAddress(window.web3.currentProvider.selectedAddress);
    this.changeChainID(); // not necessary rn since default is 0x3...
    this.finishInitialization();
  },
  finishInitialization: async function()
  {
    document.getElementById("successPage").style.display = "none";
    await App.sleep(400);
    App.endLoad();
    document.getElementById("listOwnedSongs").classList.add('active');
    document.getElementById("uploadNewSong").classList.remove('active');
    document.getElementById("listPurchasableSongs").classList.remove('active');
    document.getElementById("searchIcon").classList.add('owned');
    //
    document.getElementById("searchMenu").style.display = "block";
    document.getElementById("buyCoins").style.display = "none";
    App.listSongs("songsList", 0);
    App.displayBalance();
  },
  changeChainID: async function()
  {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x3' }],
    });
  },
  gotData: function(data)
  {
    //
  },
  errData: function(err)
  {
    console.log('Database error...');
  	console.log(err);
  },
  startLoad: function()
  {
    document.getElementById("body").classList.add('loading_div');
    document.getElementById("loadingPage").style.display = "block";
  },
  endLoad: function()
  {
    document.getElementById("body").classList.remove('loading_div');
    document.getElementById("loadingPage").style.display = "none";
  },
  successLoad: async function()
  {
    document.getElementById("loadingPage").style.display = "none";
    document.getElementById("successPage").style.display = "block";
    await App.sleep(400);
    document.getElementById("successPage").style.display = "none";
    App.endLoad();
  },
  embedToID:function(embed)
  {
    var firstIndex = embed.indexOf("api.soundcloud.com/tracks/");
    var endIndex = embed.indexOf("secret_token");
    return(embed.substring(firstIndex+26, endIndex-3));
  },
  embedToKey:function(embed)
  {
    var firstIndex = embed.indexOf("secret_token");
    if(firstIndex == -1)
    {
      return false;
    }
    var endIndex = embed.indexOf("&color=%");
    return(embed.substring(firstIndex+15, endIndex));
  },
  generateFLid: function(artistName)
  {
    var FLid = ""
    var ch = 'a';
    for(let i = 0; i < artistName.length; i++)
    {
      var currentChar = artistName.codePointAt(i);
      //
      var addChar = ('000' + currentChar).substr(-3);
      FLid += addChar;
    }
    return FLid;
  },
  generateArtistName: function(FLid)
  {
    var artistName = ""
    for(let i = 0; i < FLid.length / 3; i++)
    {
      var currentASCII = String.fromCharCode(FLid.substring(i*3,(i*3)+3));
      artistName += currentASCII;
    }
    return artistName;
  },
  userData: async function(auth_code)
  {
    var soundcloud_url = "https://api-v2.soundcloud.com/me/verified-profile?";
    var proxy_url = "https://thawing-plains-01625.herokuapp.com/"

    var url = proxy_url + soundcloud_url;

    var xhr = new XMLHttpRequest();
    await xhr.open("GET", url);
    //
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // unsure about this one -- explore later
    //
    xhr.setRequestHeader("accept", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "OAuth " + auth_code);
    //
    xhr.send();
    const dataPromise = new Promise(function(resolve, reject)
    {
      setTimeout(() => {
        reject("failed");
      }, 200000);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) 
        {
            resolve(xhr.responseText);
        }};
    });
    return dataPromise;
  },
  urlToData :async function(trackID, trackKey, auth_code)
  {
    var soundcloud_url = "https://api-v2.soundcloud.com/tracks/" + trackID + "?secret_token=" + trackKey;
    var proxy_url = "https://thawing-plains-01625.herokuapp.com/"

    var url = proxy_url + soundcloud_url;

    var xhr = new XMLHttpRequest();
    await xhr.open("GET", url);
    //
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // unsure about this one -- explore later
    //
    xhr.setRequestHeader("accept", "application/json; charset=utf-8");
    xhr.setRequestHeader("Authorization", "OAuth " + auth_code);
    //
    xhr.send();

    const dataPromise = new Promise(function(resolve, reject)
    {
      setTimeout(() => {
        reject("failed function(urlToData)");
      }, 4000);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) 
        {
            // console.log(xhr.status);
            // console.log(xhr.responseText);
            resolve(xhr.responseText);
        }};
    });
    return dataPromise;
  },
  displayBalance: async function()
  {
    let thisBalance = -1;
    await App.contracts.FLContract.methods.get_balance(App.user_address).call().then(
      function(r){
        thisBalance = r;
      })
    $("#editAmount").html('$FLC Balance  <b> ' +thisBalance+ '</b> <i class="large orange music icon"></i>');
  },
  buyCoins: async function(quantity)
  {
    App.startLoad();
    var option={'value': quantity * 250000000000000000, from:App.handler, 'gas': App.SGPrice}
    
    await App.contracts.FLContract.methods.buy_coins(quantity).send(option)
    .on('receipt',(receipt)=>
    {
      if(receipt.status)
      { // this looks like shit intentionally (as a joke LOL)
        console.log("Got receipt from buy_coins (FLContract method)...");
        //
      }}).on('error',(err)=>
      {
        //
        console.log("error from buy_coins (FLContract method): " + err); App.endLoad(); return;
    })
    //
    App.displayBalance();
    App.successLoad();
    //display coins
    //
  },
  unlistSong:async function(artist_FLid, trackID, cur_key) // this should be a smart contract function
  {
    App.startLoad();

    var option={from:App.handler, 'gas': App.SGPrice}
    await App.contracts.FLContract.methods.unlist_song(trackID).send(option)
    .on('receipt',(receipt)=>
    {
      if(receipt.status)
      { // this looks like shit intentionally (as a joke LOL)
        console.log("Unlisted song (SC confirmation)");
      }}).on('error',(err)=>{
        console.log("error from add_music (FLContract method): " + err); App.endLoad(); return;
      })
    database.ref('songs/' + artist_FLid + "/" + trackID + "/" +  cur_key + "/track_purchasable").set("0");
    App.successLoad();
    App.listSongs("songsList", 0);
    App.finishInitialization();
    return;
  },
  addSong:async function(trackCost, trackID, trackKey) // returns if successfully added to the database
  {
    //Check if fields filled out
    if(trackCost == '' || trackID == '' || trackKey == '')
    {alert('Must be a privated track'); return false;}
    App.startLoad();
    //Check using verify_add if song exists in databse / smart contract already -- unmapped songs will map to address 0x00... etc.
    var existsInDatabase = false;
    await App.contracts.FLContract.methods.verify_add(trackID).call().then(function(r){if(r != "0x0000000000000000000000000000000000000000"){
      console.log("Song already exists in FLDatabase");existsInDatabase = true;}});
    if(existsInDatabase){App.endLoad();return false;}
    
    //get and check if the song exists on soundcloud (retrievable by id)
    var songDataUnparsed;
    await App.urlToData(trackID, trackKey, App.authentication_code).then(response =>
      {
        songDataUnparsed = response;
      }).catch(async e => {
        console.log("failed URL thing..." );
        if(App.firstTryAdd)
        {
          App.firstTryAdd = false;
          console.log("retrying");
          await App.sleep(400);
          App.addSong(trackCost, trackID, trackKey);
        }
        else
        {
          App.endLoad();
          return false;
        }
      });
    //
    if(songDataUnparsed == "" || songDataUnparsed == null){console.log("Request to soundcloud-api failed."); App.endLoad(); return false;}
    
    // //wrapped that fucker ina  promise yerrrrrrrr
    var songData = JSON.parse(songDataUnparsed);
    // console.log(songData);

    
    //call add_song in smart contract --> let result determine whether to store the result in the database
    var option={from:App.handler, 'gas': App.SGPrice}
    await App.contracts.FLContract.methods.add_music(trackID, trackCost, trackKey).send(option)
    .on('receipt',(receipt)=>
    {
      if(receipt.status)
      { // this looks like shit intentionally (as a joke LOL)
        console.log("Got receipt from add_music (FLContract method)...");
      }}).on('error',(err)=>{
        console.log("error from add_music (FLContract method): " + err); App.endLoad(); return;
      })
    //
    //await App.contracts.FLContract.methods.add_music(trackID, trackCost, trackKey).send({from: App.handler});
    //check to see if add_music went through regardless of receipt (hopefully to circumnavigate gas interference) --THIS DOESN't CIRUMNAVIGATE IT ITS FUCKED LOL
    var verified = false;
    await App.contracts.FLContract.methods.verify_add(trackID).call().then(function(r){if(r == App.user_address){verified = true;}else{verified = false;}});
    if(!verified){console.log("error verifying that add_music succeeded"); App.endLoad(); return false;}
    
    console.log("Adding song: " + trackID + " to database.");
    var artist_FLid = App.generateFLid(songData.user.username);
    //
    var data = {
      track_id: trackID,
      track_name: songData.title,
      track_artist: songData.user.username,
      track_url: songData.permalink_url,
      track_token: trackKey,
      track_price: trackCost,
      track_purchasable: 1,
      track_owner: App.user_address,
      track_cover: songData.artwork_url,
      track_date: songData.created_at,
      artist_cover: songData.user.avatar_url
  	}
  	var ref = database.ref('songs/' + artist_FLid + "/" + trackID);
  	ref.push(data);

    console.log("song data successfully stored. (addSong)");
    await App.sleep(200);
    App.successLoad();
    App.finishInitialization();
  },
  sellSong:async function(trackID, FLid, uniqueKey)
  {
    //get track cost
    trackCost = jQuery('#' + trackID + "_sellAmount").val();
    console.log("Attempting to sell track: " + trackID+ ", for " + trackCost +" $FLC.");
    //check if fields are empty
    if(trackID == '' || trackCost == ''){alert('All required fields must be filled out');return;}

    //
    App.startLoad();
    //

    //sell music smart contract
    var option={from:App.handler, 'gas': App.SGPrice}
    await App.contracts.FLContract.methods.sell_music(trackID, trackCost).send(option)
    .on('receipt',(receipt)=>
    {
      if(receipt.status)
      { // this looks like shit intentionally (as a joke LOL)
        console.log("Got receipt from sell_music (FLContract method)...");
      }})
    .on('error',(err)=>{
        console.log("error from sell_music (FLContract method): " + err); App.endLoad(); return;
    })

    //continue to verify -- one step further before putting it into the database
    var verified = false;
    await App.contracts.FLContract.methods.verify_sell(trackID).call().then(function(r){if(r == trackCost){verified = true;}else{verified = false;}});
    if(!verified){console.log("error verifying that sell_music succeeded"); App.endLoad(); return false;}

    //I don't know if these verifications are necessary but it allows me to sleep better at night
    
    await database.ref('songs/' + FLid + "/" + trackID + "/" + uniqueKey + "/track_price").set(trackCost);
    await database.ref('songs/' + FLid + "/" + trackID + "/" + uniqueKey + "/track_purchasable").set(1);

    console.log("Succesfully sold song.");
    App.successLoad();
    App.finishInitialization();
  },
  buySong:async function(trackID, FLid, uniqueKey)
  {
    //call buy_music smart contract
    App.startLoad();
    var trackCost = -1;
    await App.contracts.FLContract.methods.verify_sell(trackID).call().then(function(r){
      trackCost = r;
    });

    if(trackCost <= 0){App.endLoad(); return false;}


    //THIS IS REPLACED ONLY FOR PHASE 3 DEMO
    // var option={'value': trackCost, from:App.handler}
      
    // await App.contracts.FLContract.methods.buy_music(trackID).send(option)
    // .on('receipt',(receipt)=>
    // {
    //   if(receipt.status)
    //   { // this looks like shit intentionally (as a joke LOL)
    //     console.log("Got receipt from buy_music (FLContract method)...");
    //   }}).on('error',(err)=>{
    //     console.log("error from buy_music (FLContract method): " + err); App.endLoad(); return;
    // })
    //
    var option={from:App.handler, 'gas': App.SGPrice}
      
    await App.contracts.FLContract.methods.buy_music(trackID).send(option)
    .on('receipt',(receipt)=>
    {
      if(receipt.status)
      { // this looks like shit intentionally (as a joke LOL)
        console.log("Got receipt from buy_music (FLContract method)...");
      }}).on('error',(err)=>{
        console.log("error from buy_music (FLContract method): " + err); App.endLoad(); return;
    })

    //verify transaction
    var verified = false;
    await App.contracts.FLContract.methods.verify_buy(trackID).call().then(function(r){if(r == App.user_address){verified = true;}else{verified = false;}});
    if(!verified){console.log("error verifying that buy_music succeeded"); App.endLoad(); return false;}
    
    //add to database
    await database.ref('songs/' + FLid + "/" + trackID + "/" + uniqueKey + "/track_owner").set(App.user_address);
    await database.ref('songs/' + FLid + "/" + trackID + "/" + uniqueKey + "/track_purchasable").set(0);

    console.log("Succesfully sold song.");
    App.listSongs("songsList", 1);
    App.displayBalance();
    App.successLoad();
  },
  listSongs: async function(divName, listType, searchFLid = "") //listType == 0, Owned Songs, listType == 1, Purchasable Songs
  {
    $("#"+divName).html('<div class="people-nearby" id=" '+divName+' ">');
    var songsRef = database.ref('songs');

    var data;
    App.startLoad();
    await App.sleep(200);
    await songsRef.on('value', (snapshot) =>
    {
      data = snapshot.val();
    });
    App.endLoad();
    if(data == null){return;}
    
    var songList = [];
    var keyList = [];
    var searchText = jQuery('#searchText').val();

    if(searchFLid != ""){console.log("searching for songs by FLid: '" +searchText+ "'");}

    //populate songList with relevant data
    var artistKeys = Object.keys(data);
    for(let i = 0; i < artistKeys.length; i++)
    {
      currentArtist = data[artistKeys[i]];
      var songKeys = Object.keys(currentArtist);
      for(let y = 0; y < songKeys.length; y++)
      {
        var dbKey = Object.keys(currentArtist[songKeys[y]]).at(0);
        var songData = currentArtist[songKeys[y]][dbKey];
        if(listType == 0)
        {
          if(songData.track_owner == App.user_address && songData.track_purchasable == 0 && (searchFLid == "" || App.generateFLid(songData.track_artist) == searchFLid))
          {
            songList.push(songData);
            keyList.push(dbKey);
            continue;
          }
        }
        else if(listType == 1)
        {
          if(songData.track_owner != App.user_address && songData.track_purchasable == 1 && (searchFLid == "" || App.generateFLid(songData.track_artist) == searchFLid)) //replace with FLid
          {
            songList.push(songData);
            keyList.push(dbKey);
            continue;
          }
        }
        else if(listType == 2)
        {
          if(songData.track_owner == App.user_address && songData.track_purchasable == 1 && (searchFLid == "" || App.generateFLid(songData.track_artist) == searchFLid))
          {
            songList.push(songData);
            keyList.push(dbKey);
            continue;
          }
        }
      }
    }
    console.log(songList);
    for(let i = 0; i < songList.length; i++) //PASS IN UNIQUE KEY (FIREBASE THING)
    {
      if(listType == 1)
      {$("#" + divName).append(this.createListElemPurchasable(songList[i], keyList[i]));}
      else if(listType == 0)
      {$("#" + divName).append(this.createListElem(songList[i], keyList[i]));}
      else if(listType == 2)
      {
        {$("#" + divName).append(this.createListElemListed(songList[i], keyList[i]));}
      }
    }
  },
  listenSong(songURL)
  {
    window.open(songURL, "_blank");
  },
  LTHLink(pictureURL)
  {
    var firstOcc = pictureURL.indexOf("large.jpg");
    var newURL = pictureURL.substring(0,firstOcc) + "t500x500.jpg";
    return newURL;
  },
  createListElemPurchasable(songData, uniqueKey)
  {
    var buyButtonID = songData.track_id + "_buy";
    var cover_source = "";
    if(songData.track_cover == undefined){cover_source = App.LTHLink(songData.artist_cover);}else{cover_source = App.LTHLink(songData.track_cover);}
    var addThisHTML =
    '<div class="ui placeholder segment">\
    <div class="ui two column very relaxed stackable grid">\
      <div class="column">\
        <div class="ui form">\
          <img class="cover_art" src="' + cover_source + '">\
          <a class="song_info">\
            <b>'+songData.track_name +'</b>\
            <i class ="yellow star icon" id="star_icon"></i>\
          </a>\
          <a class="artist_name"><i>'+songData.track_artist+'</i></a>\
          <a class="price">\
          <i class = "music icon"></i>\
          <i>'+songData.track_price+'</i></a>\
          <p class="flid_info"><i>FLid: ' + App.generateFLid(songData.track_artist) + '</i></p>\
          <img class="artist_picture" src="' +songData.artist_cover + '">\
        </div>\
      </div>\
      <div class="middle aligned column">\
      <div class = "ui buttons">\
        <div class="ui big orange button" id="'+buyButtonID+'">\
          <i>'+songData.track_price+'</i>\
          <i class="music icon" id = ></i>\
          Buy\
        </div>\
        <div class="ui big button">\
          <i class="history icon" id = ></i>\
          View History\
        </div>\
      </div>\
    </div><div class="ui vertical divider">\
    </div>'
    if(!this.mappedButtons.includes(buyButtonID))
      {
        this.mappedButtons.push(buyButtonID);
        $(document).on('click', "#"+buyButtonID, function()
        {
          // App.buySong(songData.track_url);
          App.buySong(songData.track_id, App.generateFLid(songData.track_artist), uniqueKey);
        });
      }
      return addThisHTML;
  },
  createListElemListed(songData, uniqueKey)
  {
    var unlistButtonID = songData.track_id + "_unlist";
    var cover_source = "";
    if(songData.track_cover == undefined){cover_source = App.LTHLink(songData.artist_cover);}else{cover_source = App.LTHLink(songData.track_cover);}
    var addThisHTML =
    '<div class="ui placeholder segment">\
    <div class="ui two column very relaxed stackable grid">\
      <div class="column">\
        <div class="ui form">\
          <img class="cover_art" src="' + cover_source + '">\
          <a class="song_info">\
            <b>'+songData.track_name +'</b>\
            <i class ="yellow star icon" id="star_icon"></i>\
          </a>\
          <a class="artist_name"><i>'+songData.track_artist+'</i></a>\
          <a class="price">\
          <i>Listed For: '+songData.track_price+'</i>\
          <i class = "music icon"></i></a>\
          <p class="flid_info"><i>FLid: ' + App.generateFLid(songData.track_artist) + '</i></p>\
          <img class="artist_picture" src="' +songData.artist_cover + '">\
        </div>\
      </div>\
      <div class="middle aligned column">\
      <div class = "ui buttons">\
        <div class="ui big red button" id="'+unlistButtonID+'">\
          <i class="undo icon" id = ></i>\
          Unlist\
        </div>\
        <div class="ui big button">\
          <i class="history icon" id = ></i>\
          View History\
        </div>\
      </div>\
    </div><div class="ui vertical divider">\
    </div>'
    if(!this.mappedButtons.includes(unlistButtonID))
      {
        this.mappedButtons.push(unlistButtonID);
        $(document).on('click', "#"+unlistButtonID, function()
        {
          App.unlistSong(App.generateFLid(songData.track_artist), songData.track_id,uniqueKey);
        });
      }
      return addThisHTML;
  },
  createListElem(songData, uniqueKey)
  {
    var listenButtonID = songData.track_id + "_listen";
    var sellButtonID = songData.track_id + "_sell";
    var openSellID = songData.track_id + "_openSell";
    var sellFormID = songData.track_id + "_sellForm";
    var sellAmountID = songData.track_id +"_sellAmount";
    //
    var CA_ID = songData.track_id+"_CA";
    var SI_ID = songData.track_id+"_SI";
    var AN_ID = songData.track_id+"_AN";
    var FI_ID = songData.track_id+"_FI";
    var AP_ID = songData.track_id+"_AP";
    //
    var cover_source = "";
    if(songData.track_cover == undefined){cover_source = App.LTHLink(songData.artist_cover);}else{cover_source = App.LTHLink(songData.track_cover);}
    var addThisHTML =
    '<div class="ui placeholder segment">\
    <div class="ui two column very relaxed stackable grid">\
      <div class="column">\
        <div class="ui form">\
          <img class="cover_art" id="'+CA_ID+'" src="' + cover_source + '">\
          <a class="song_info" id="'+SI_ID+'">\
            <b>'+songData.track_name +'</b>\
            <i class ="yellow star icon" id="star_icon"></i>\
          </a>\
          <a class="artist_name" id="'+AN_ID+'" ><i>'+songData.track_artist+'</i></a>\
          <p class="flid_info" id="'+FI_ID+'" ><i>FLid: ' + App.generateFLid(songData.track_artist) + '</i></p>\
          <img class="artist_picture"  id="'+AP_ID+'" src="' +songData.artist_cover + '">\
        </div>\
      </div>\
      <div class="middle aligned column">\
      <div class = "ui buttons">\
      <div class="ui big orange submit button" id="'+listenButtonID+'">\
       <i class="play icon" id = ></i>\
        Listen\
      </div>\
        <div class="ui big blue button" id = "'+openSellID+'">\
          <i class="music icon" id = ></i>\
          Sell\
        </div>\
        <div class="ui big button">\
          <i class="history icon" id = ></i>\
          View History\
        </div>\
      </div>\
    </div><div class="ui vertical divider">\
    </div>\
    <div class="sell-form-popup" id="'+sellFormID+'" action="javascript:void(0);">\
        <form class="form-container" action="javascript:void(0);">\
          <h1>Sell Song</h1>\
          <label for="name"><b>Price</b></label>\
          <input type="number" id="'+sellAmountID+'" placeholder="Enter Price (in $FLC)" name="sellPrice" required>\
          <button class="btn login" id="'+sellButtonID+'">Sell</button>\
        </form>\
      </div>'
    if(!this.mappedButtons.includes(listenButtonID))
      {
        this.mappedButtons.push(listenButtonID);
        $(document).on('click', "#"+listenButtonID, function()
        {
          App.listenSong(songData.track_url);
          // App.buySong(songData.track_id, App.generateFLid(songData.track_artist), uniqueKey);
        });
      }
      if(!this.mappedButtons.includes(openSellID))
      {
        this.mappedButtons.push(openSellID);
        $(document).on('click', "#"+openSellID, function()
        {
          document.getElementById(sellFormID).style.display = "block";

          document.getElementById(CA_ID).style.top = "-22px";
          //
          document.getElementById(SI_ID).style.top = "-2px"; 
          document.getElementById(FI_ID).style.top = "58px";
          document.getElementById(AP_ID).style.top = "108px";
          document.getElementById(AN_ID).style.top = "20px";

          // App.buySong(songData.track_id, App.generateFLid(songData.track_artist), uniqueKey);
        });
      }
      if(!this.mappedButtons.includes(sellButtonID))
      {
        this.mappedButtons.push(sellButtonID);
        $(document).on('click', "#"+sellButtonID, function()
        {
          document.getElementById(sellFormID).style.display = "none";
          //
          document.getElementById(CA_ID).style.top = "-110px";
          //
          document.getElementById(SI_ID).style.top = "-90px";
          document.getElementById(FI_ID).style.top = "-30px";
          document.getElementById(AP_ID).style.top = "20px";
          document.getElementById(AN_ID).style.top = "-68px";
          //
          App.sellSong(songData.track_id, App.generateFLid(songData.track_artist), uniqueKey);
        });
      }
      window.addEventListener('click', function(e){
        if(!this.document.getElementById(sellFormID)){return;}
        if (!document.getElementById(sellFormID).contains(e.target) && !document.getElementById(openSellID).contains(e.target))
        {
          document.getElementById(sellFormID).style.display = "none";
          //
          document.getElementById(CA_ID).style.top = "-110px";
          document.getElementById(SI_ID).style.top = "-90px";
          document.getElementById(FI_ID).style.top = "-30px";
          document.getElementById(AP_ID).style.top = "20px";
          document.getElementById(AN_ID).style.top = "-68px";
        }
      })
      return addThisHTML;
  },
  createElement(songData, uniqueKey)
  {
    var buyButtonID = songData.track_id + "_buy";
    var addThisHTML =
    '<div class="nearby-user" id="'+ songData.trackID +'_listedDiv" >\
                            <div class="row">\
                              <div class="col-md-7 col-sm-4">\
                                <img src="' + songData.track_cover + '" alt="user" class="profile-photo-lg">\
                              </div>\
                              <div class="col-lg-1 col-sm-1">\
                                <img src="' + songData.artist_cover + '" alt="user" class="profile-photo-md">\
                              </div>\
                                <div class="col-md-7 col-sm-7">\
                                  <h5><p class="profile-link">' + songData.track_name + '</p></h5>\
                                  <p>' + songData.track_price + ' $FLC</p>\
                                </div>\
                                <div class="col-md-4 col-md-1">\
                                  <p>' + songData.track_artist + ' || FLid:' + generateFLid(songData.track_artist) + '</p>\
                                  <button class="btn btn-primary pull-right" id="' + buyButtonID + '">Buy Song</button>\
                                </div>\
                            </div>\
      </div>'

      //bind events
      if(!this.mappedButtons.includes(buyButtonID))
      {
        this.mappedButtons.push(buyButtonID);
        $(document).on('click', "#"+buyButtonID, function()
        {
          App.buySong(songData.track_id, App.generateFLid(songData.track_artist), uniqueKey);
        });
      }
      return addThisHTML;
  },
  createOwnElement(songData, uniqueKey)
  {
    var sellButtonID = songData.track_id + "_sell";
    var sellpriceID = songData.track_id + "_sellprice";
    var unlistButtonID = songData.track_id + "_unlist";
    var fullURL = "listen at: <i>" + songData.track_url+ "</i>";
    var styleML = "";
    var FSText = "";
    //
    if(songData.track_purchasable == 1)
    {
      styleML = 'style="background-color:#e3ffde"';
      FSText = "Currently Listed For: <i><b>" + songData.track_price + "</i></b> $FLC"
    }
    else
    {
      styleML = 'style="background-color:#decacd"';
      FSText = "Currently Unlisted"
    }
    //
    var addThisHTML =
    '<div class="nearby-user" '+ styleML +' id="'+ songData.track_id +'_ownedDiv" >\
                            <div class="column">\
                            <p>' + fullURL + '</p>\
                            </div>\
                            <div class="row">\
                              <div class="col-md-7 col-sm-4">\
                                <img src="' + songData.track_cover + '" alt="user" class="profile-photo-lg">\
                              </div>\
                              <div class="col-lg-1 col-sm-1">\
                                <img src="' + songData.artist_cover + '" alt="user" class="profile-photo-md">\
                              </div>\
                                <div class="col-md-7 col-sm-7">\
                                  <h5><p class="profile-link">' + songData.track_name + '</p></h5>\
                                  <input type="number" class="form-control" id="' + sellpriceID + '" placeholder="sell price">\
                                  <p>' +FSText+ '</p>\
                                </div>\
                                <div class="col-md-4 col-md-1">\
                                  <p>' + songData.track_artist + '</p>\
                                  <button class="btn btn-primary pull-right" id="' + sellButtonID + '">Sell Song</button>\
                                  <p> </p>\
                                  <button class="btn btn-primary pull-right" id="' + unlistButtonID + '">Unlist Song</button>\
                                </div>\
                            </div>\
      </div>'

      //bind events:
      let sellElem = (document.getElementById(sellButtonID));
      let sellPriceElem = (document.getElementById(sellpriceID));
      let unlistElem = (document.getElementById(unlistButtonID));

      if(!this.mappedButtons.includes(sellButtonID))
      {
        this.mappedButtons.push(sellButtonID);
        $(document).on('click', "#"+sellButtonID, function()
        {
          App.sellSong(songData.track_id, App.generateFLid(songData.track_artist), uniqueKey);
        });
      }
      //
      if(!this.mappedButtons.includes(unlistButtonID))
      {
        this.mappedButtons.push(unlistButtonID);
        $(document).on('click', "#"+unlistButtonID, function()
        {
          App.unlistSong(songData.track_id);
        });
      }
      //
      return addThisHTML;
  },
  decToHex:function (num) 
  {
    return parseInt(num, 10).toString(16);
  },
  abi:
  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "secret_key",
          "type": "string"
        }
      ],
      "name": "add_music",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "buy_coins",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        }
      ],
      "name": "buy_music",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contract_owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "adr",
          "type": "address"
        }
      ],
      "name": "get_balance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        }
      ],
      "name": "get_price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "id_to_owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "id_to_price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "id_to_purchasable",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "id_to_secret_key",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "sell_music",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        }
      ],
      "name": "unlist_song",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        }
      ],
      "name": "verify_add",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        }
      ],
      "name": "verify_buy",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "track_id",
          "type": "uint256"
        }
      ],
      "name": "verify_sell",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawalAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}

$(function() {
  $(window).load(function() {
    App.init();
    toastr.options = {
      // toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      // }
    };
  });
});

