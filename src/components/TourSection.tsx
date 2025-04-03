// Real tour data from Bandsintown
const tourDates = [
  { 
    id: 1, 
    date: "APR 05 - FRI", 
    venue: "Sons Of Hermann Hall", 
    location: "Dallas, TX", 
    ticketLink: "https://www.bandsintown.com/e/106617249-blake-whiten-at-sons-of-hermann-hall?came_from=251&utm_medium=web&utm_source=artist_page&utm_campaign=ticket_rsvp" 
  },
  { 
    id: 2, 
    date: "APR 19 - FRI", 
    venue: "TempleLive Fort Smith", 
    location: "Fort Smith, AR", 
    ticketLink: "https://www.bandsintown.com/e/106617283-blake-whiten-at-temple-live-fort-smith-fort-smith-ar?came_from=251&utm_medium=web&utm_source=artist_page&utm_campaign=event" 
  },
  { 
    id: 3, 
    date: "APR 25 - THU", 
    venue: "Wendell's", 
    location: "Anderson, SC", 
    ticketLink: "https://www.bandsintown.com/e/106617307-blake-whiten-at-wendell's?came_from=251&utm_medium=web&utm_source=artist_page&utm_campaign=ticket_rsvp" 
  },
  { 
    id: 4, 
    date: "APR 29 - MON", 
    venue: "The Roxy Theatre", 
    location: "Los Angeles, CA", 
    ticketLink: "https://www.bandsintown.com/e/106617330-blake-whiten-at-the-roxy-theatre?came_from=251&utm_medium=web&utm_source=artist_page&utm_campaign=ticket_rsvp" 
  },
  { 
    id: 5, 
    date: "MAY 08 - WED", 
    venue: "The Barrelhouse Ballroom", 
    location: "Chattanooga, TN", 
    ticketLink: "https://www.bandsintown.com/e/106617352-blake-whiten-at-the-barrelhouse-ballroom?came_from=251&utm_medium=web&utm_source=artist_page&utm_campaign=ticket_rsvp" 
  },
  { 
    id: 6, 
    date: "MAY 09 - THU", 
    venue: "Coyote Joe's", 
    location: "Charlotte, NC", 
    ticketLink: "https://www.bandsintown.com/e/106617376-blake-whiten-at-coyote-joe's?came_from=251&utm_medium=web&utm_source=artist_page&utm_campaign=event" 
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
              View All 12 Upcoming Shows on Bandsintown
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourSection;
