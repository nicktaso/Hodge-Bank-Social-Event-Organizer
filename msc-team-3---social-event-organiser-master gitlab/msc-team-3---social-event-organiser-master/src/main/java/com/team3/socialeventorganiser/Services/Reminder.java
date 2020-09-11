package com.team3.socialeventorganiser.Services;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;


import com.team3.socialeventorganiser.Models.User;
import com.team3.socialeventorganiser.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

@Component
public class Reminder {
    @Autowired
    private ThreadPoolTaskScheduler taskScheduler;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    // Considering, that there shall be only one reminder for each event, they can be stored in a map -
    // key: eventId, value: ScheduledFuture as a scheduled reminder datatype.
    private Map <Integer, ScheduledFuture> eventReminderMap = new HashMap<>();

    public void scheduleReminder(int event_id, long date) {
        // Checks if this event has already reminder
        if (eventReminderMap.containsKey(event_id)) {
            // If yes, it means that event has been modified. So cancel existing reminder.
            eventReminderMap.get(event_id).cancel(true); }

        // Schedule a reminder for this event
        eventReminderMap.put(event_id, taskScheduler.schedule(new ReminderTrigger(event_id), new Date(date)));
    }

    // Function called during event removal. Cancels scheduled remainder for deleted event.
    public void deleteReminder(int event_id) {
        if (eventReminderMap.containsKey(event_id)) {
            eventReminderMap.get(event_id).cancel(true); }
    }

    class ReminderTrigger implements Runnable {

        private int event_id;

        public ReminderTrigger(int event_id) {
            this.event_id = event_id;
        }

        @Override
        public void run() {
            List<User> userList = userRepository.usersByEventStatus(event_id,2);
            Email email = new Email(event_id,userList);
            email.onReminder(javaMailSender);
        }
    }
}