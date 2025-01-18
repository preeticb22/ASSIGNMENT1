const events = require('../data/events');

exports.addEvent = (req, res) => {
    const { title, description, time } = req.body;

    if (!title || !description || !time) {
        return res.status(400).send({ message: "Title, description, and time are required" });
    }

    const newEvent = {
        id: events.length + 1,
        title,
        description,
        time,
        notified: false,
        completed: false,
    };

    events.push(newEvent);
    res.status(201).send({ message: "Event created successfully", event: newEvent });
};

exports.getEvents = (req, res) => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => new Date(event.time) > now && !event.completed);
    res.status(200).send(upcomingEvents);
};
