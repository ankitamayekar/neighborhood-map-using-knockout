
var map,add1,add2;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'),{
		center:{lat: 47.639325,lng: -122.128538}, 
		zoom: 12
		});
}
var modelLocations =[
		
        {title: 'In.gredents',desc:'Fine Dining Restaurant ',area:'redmond',location: {lat: 47.645410, lng: -122.124633}},
        {title: 'Spazzo',desc:'Italian Restaurant Cheery eatery featuring many wines by the glass & Italian basics, with big-screen TV in lively bar.', area:'redmond',location: {lat: 47.670385, lng: -122.119998}}, 
        {title: 'Seoul Hot Pot',desc:' Korean Restaurant Traditional Korean barbecue & other standards offered up in a modest, compact setting.',area:'redmond',location: {lat: 47.636620, lng: -122.136993}}, 
        {title: 'Peking', desc:'Asian Restaurant Family-owned Chinese joint with a focus on housemade noodles plus classic fare since 1983.',area:'redmond', location: {lat: 47.628345, lng: -122.151638}},
	    {title: 'Costco Food Court', desc:'Located in: Costco Wholesale',area:'Kirkland', location: {lat: 47.681103, lng: -122.181766}},
		{title: 'La Casita', desc:'Festive family restaurant serving a wide variety of Mexican standards with bottomless chips & salsa.',area:'sammamish', location: {lat: 47.583221, lng: -122.033234}},
		{title: 'Taco Time', desc:'Longtime Mexican fast-food chain serving tacos, crisp burritos & kids meals in simple surrounds.',area:'Issaquah', location: {lat: 47.608226, lng: -122.033234}},
		{title: 'Bombay House', desc:'Indian restaurant specializing in vegetarian & vegan cooking, with gluten-free options available.',area:'Bellevue', location: {lat: 47.576737, lng: -122.136231}},
        {title: 'Wild Ginger',desc:'Busy, sleek restaurant with Pacific Rim fare, happy hour & weekend dim sum brunch.',area:'bellevue',location: {lat: 47.617993, lng: -122.201366}}
] ;
var locationView =  function(CurrentLocation) {
        // update the DOM elements with values from the current location
        var self = this;
		this.title = CurrentLocation.title;
		this.lat = CurrentLocation.location.lat;
		this.lng = CurrentLocation.location.lng;
		this.add1 = "";
		this.add2 = "";
		this.desc = CurrentLocation.desc;
		this.contentString = "";
		this.visible = ko.observable(true);
		//alert(CurrentLocation.desc);
		/* Importing information from FourSquare 
		CLIENT_ID
		SXTB4PSIKGVCH3HTSYBZY4RFJJB5CDWX44Q31KYJUVU3BCVO
		CLIENT_SECRET
		JGY3V3KIAXQVYL1FBU0HZ5KYZTPYKXGQEKTZFPEO2JEKHZGJ
		version 
		20161016 */
		var ResponseURL ='https://api.foursquare.com/v2/venues/search?ll='+this.lat+','+this.lng+'&client_id=SXTB4PSIKGVCH3HTSYBZY4RFJJB5CDWX44Q31KYJUVU3BCVO&client_secret=JGY3V3KIAXQVYL1FBU0HZ5KYZTPYKXGQEKTZFPEO2JEKHZGJ&v=20161016&query='+this.title+'&limit=1';
		//extract the required information from received information ( address )
		$.getJSON(ResponseURL).done(function(information) {
			var resultInfo = information.response.venues[0];
			self.add1 = resultInfo.location.formattedAddress[0];
			self.add2 = resultInfo.location.formattedAddress[1];
			//add a marker for currently selected restuarant
			this.marker = new google.maps.Marker({
				position: new google.maps.LatLng(self.lat , self.lng),
				//position:CurrentLocation.location,
				map:map,
				//animation: google.maps.Animation.DROP,
				title:CurrentLocation.title	
			});
			
			
			//marker.addListener('click', toggleBounce);
			this.marker.addListener('click', function() {
				//add info window to the marker
				self.contentString ='<div><div><b>'+CurrentLocation.title+'</b></div><div>'+self.add1 +'</div><div>'+self.add2 +'</div><hr><div>'+CurrentLocation.desc +'</div></div>';
				self.infowindow = new google.maps.InfoWindow({
					content: self.contentString,
					maxWidth: 200
				}); 
				self.infowindow.open(map, this);
				
			});
		
		}).fail(function() {
			alert("FourSquare Error.");
		}); 
		this.openinfowindow = function(place) {
				google.maps.event.trigger(this.marker, 'click');
			};
};

function AppViewModel(){
	var self = this;
	this.myInput = ko.observable("");
	this.locArray = ko.observableArray([]);
	
	modelLocations.forEach(function(restinfo){
		self.locArray.push( new locationView(restinfo));
	});
	this.displayArray = ko.computed( function() {
		var input = self.myInput().toUpperCase();

		if (input=="") {
			self.locArray().forEach(function(restinfo){
				restinfo.visible(true);
			});
			return self.locArray();
			
		} else {
			return ko.utils.arrayFilter(self.locArray(), function(restinfo) {
			var string = restinfo.title.toUpperCase();
			var result = (string.includes(input) == true);
				restinfo.visible(result);
				return result;
			});
		}
	}, self);
	//this.mapElem = document.getElementById('map');
}
// Activates knockout.js
	ko.applyBindings(new AppViewModel());