// Real tour data from Bandsintown
const tourDates = [
  { 
    id: 1, 
    date: "JUN 26-28 - THU-SAT", 
    venue: "Country Jam Ranch", 
    location: "Mack, CO", 
    ticketLink: "https://countryjam.com/festival-passes/" 
  },
  { 
    id: 2, 
    date: "AUG 07-10 - THU-SUN", 
    venue: "VOA FESTIVAL 2025", 
    location: "Butler County, OH", 
    ticketLink: "https://voacountrymusicfest.com/?utm_source=website&utm_medium=web&utm_campaign=blakewhiten&utm_content=blakewhiten" 
  },
  { 
    id: 3, 
    date: "OCT 25 - SAT", 
    venue: "Sydney Showground", 
    location: "Sydney Olympic Park, Australia", 
    ticketLink: "https://www.axs.com/events/983677/ridin-hearts-festival-2025-tickets?cid=usaffbandsintown" 
  },
  { 
    id: 4, 
    date: "OCT 26 - SUN", 
    venue: "Caribbean Gardens", 
    location: "East Melbourne, Australia", 
    ticketLink: "https://www.axs.com/events/983676/ridin-hearts-festival-2025-tickets?cid=usaffbandsintown" 
  },
  { 
    id: 5, 
    date: "NOV 21-23 - FRI-SUN", 
    venue: "St Petes Fest 2025", 
    location: "St. Petersburg, FL", 
    ticketLink: "https://www.eventliveus.com/event/10109/spcf25" 
  }
];

const TourSection = () => {
  return (
    <section id="tour" className="py-16 pt-24 md:pt-16 bg-tan">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-maroon font-bold text-center mb-12">TOUR</h2>
        
        <div className="max-w-4xl mx-auto">
          {/* Desktop layout - hidden on mobile */}
          <div className="hidden md:block">
            {tourDates.map((event) => (
              <div key={event.id} className="flex items-center py-4 tour-row">
                <div className="w-1/6">
                  <p className="font-medium text-maroon text-sm">{event.date}</p>
                </div>
                <div className="w-1/3">
                  <p className="font-medium text-maroon text-sm">{event.venue}</p>
                </div>
                <div className="w-1/3">
                  <p className="font-medium text-maroon text-sm">{event.location}</p>
                </div>
                <div className="w-1/6 text-right">
                  <a 
                    href={event.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-maroon text-white uppercase px-4 py-1 text-xs rounded tracking-wider inline-block hover:bg-maroon/90 transition-colors"
                  >
                    Tickets
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile layout - shown only on small screens */}
          <div className="md:hidden space-y-6">
            {tourDates.map((event) => (
              <div key={event.id} className="border-b border-maroon/20 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-maroon text-sm">{event.date}</p>
                  <a 
                    href={event.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-maroon text-white uppercase px-4 py-1 text-xs rounded tracking-wider inline-block hover:bg-maroon/90 transition-colors"
                  >
                    Tickets
                  </a>
                </div>
                <p className="font-medium text-maroon text-sm mb-1">{event.venue}</p>
                <p className="text-maroon text-xs">{event.location}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="https://www.bandsintown.com/a/15580869-blake-whiten"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon hover:text-maroon/80 underline text-sm"
            >
              View All 5 Upcoming Shows on Bandsintown
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourSection;
