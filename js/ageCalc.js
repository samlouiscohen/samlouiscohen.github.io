

var montharray=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")

function countup(yr,m,d){
var today=new Date()
var todayy=today.getYear()
if (todayy < 1000)
todayy+=1900
var todaym=today.getMonth()
var todayd=today.getDate()
var todaystring=montharray[todaym]+" "+todayd+", "+todayy
var paststring=montharray[m-1]+" "+d+", "+yr
var difference=(Math.round((Date.parse(todaystring)-Date.parse(paststring))/(24*60*60*1000))*1)
document.write("I'm a whopping "+difference.toString().bold()+" days old!")
}
//enter the count up date using the format year/month/day
countup(1996,05,12)


