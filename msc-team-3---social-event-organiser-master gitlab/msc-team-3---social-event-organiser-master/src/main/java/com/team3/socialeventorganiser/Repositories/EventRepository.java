package com.team3.socialeventorganiser.Repositories;

import com.team3.socialeventorganiser.Models.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

@Repository
public class EventRepository {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public EventRepository(JdbcTemplate aTemplate) {
        jdbcTemplate = aTemplate;
    }

    public List<Event> eventsByUser(int userId) {

        return jdbcTemplate.query("select * from events where events.id in ( select event_user.event_id from event_user where event_user.user_id = " + userId + ")" ,
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public List<Event> eventsByKeyword(String keyword) {
        return jdbcTemplate.query("select * from events where events.title like " + "\"%" + keyword + "%\""  ,
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );

    }

    public List<Event> eventsByUserStatus(int userId, int status) {

        return jdbcTemplate.query("select * from events where (events.id in ( select event_user.event_id from event_user where event_user.user_id = "+ userId + " and event_user.status =" + status +"))",
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public Event eventByID(int eventId) {

        return jdbcTemplate.queryForObject("select * from events where events.id  = " + eventId ,
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public List<Event> allEvents(){
        return jdbcTemplate.query("SELECT * from events ",
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );

    }

    public int addEvent(Event event) {
        KeyHolder kh = new GeneratedKeyHolder();
        String sql="insert into events(OWNER_ID, TITLE, DESCRIPTION, LOCATION, DATE_AND_TIME, CATEGORY, EVENT_TYPE, MAX_CAPACITY, TEAM_SIZE)  values(?,?,?,?,?,?,?,?,?)";
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"ID"}); //list of auto-generated key columns
                            ps.setInt(1, event.getOwnerId());
                            ps.setString(2, event.getTitle());
                            ps.setString(3, event.getDescription());
                            ps.setString(4, event.getLocation());
                            ps.setTimestamp(5, Timestamp.valueOf(event.getDateAndTime()));
                            ps.setString(6, event.getCategory());
                            ps.setString(7, event.getType());
                            ps.setInt(8, event.getMaxCapacity());
                            ps.setInt(9, event.getTeamSize());
            return ps;
        }
                , kh);

        return Objects.requireNonNull(kh.getKey()).intValue();
    }

    public void updateEvent(Event event) {
        String sql = "update events set OWNER_ID = ?, TITLE = ?,DESCRIPTION =?,LOCATION =?,DATE_AND_TIME=?,CATEGORY=?, EVENT_TYPE=?, MAX_CAPACITY=?, TEAM_SIZE=? where id = ?";
        jdbcTemplate.update(connection -> {
            PreparedStatement update = connection.prepareStatement(sql);
            update.setInt(1, event.getOwnerId());
            update.setString(2, event.getTitle());
            update.setString(3, event.getDescription());
            update.setString(4, event.getLocation());
            update.setTimestamp(5, Timestamp.valueOf(event.getDateAndTime()));
            update.setString(6, event.getCategory());
            update.setString(7, event.getType());
            update.setInt(8, event.getMaxCapacity());
            update.setInt(9, event.getTeamSize());
            update.setInt(10, event.getId());
            return update;
        });

    }

    public List<Event> upcomingEventsByUser(int userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return jdbcTemplate.query("select * from events where events.id in ( select event_user.event_id from event_user where event_user.user_id = " + userId + " and event_user.status = 2) and events.date_and_time > " + "\'" + now + "\' ORDER BY events.date_and_time;",
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public List<Event> previousEventsByUser(int userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return jdbcTemplate.query("select * from events where events.id in ( select event_user.event_id from event_user where event_user.user_id = " + userId + " and event_user.status = 2) and events.date_and_time < " + "\'" + now + "\'",
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public List<Event> upcomingEvents(){
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return jdbcTemplate.query("select * from events where  events.date_and_time > " + "\'" + now + "\'" + "ORDER BY events.date_and_time ASC LIMIT 7;",
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public List<Event> owningEventsByUser(int userId){
        return jdbcTemplate.query("select * from events where events.owner_id=" + userId,
                new Object[]{},
                (rs, i) -> new Event(
                        rs.getInt("ID"),
                        rs.getInt("OWNER_ID"),
                        rs.getString("TITLE"),
                        rs.getString("DESCRIPTION"),
                        rs.getString("LOCATION"),
                        rs.getTimestamp("DATE_AND_TIME").toLocalDateTime(),
                        rs.getString("CATEGORY"),
                        rs.getString("EVENT_TYPE"),
                        rs.getInt("MAX_CAPACITY"),
                        rs.getInt("TEAM_SIZE")
                )
        );
    }

    public int deleteEvent(int eventId){
        return jdbcTemplate.update("DELETE FROM events WHERE id = " + eventId);
    }

}


