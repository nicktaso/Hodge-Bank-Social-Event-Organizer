package com.team3.socialeventorganiser.Repositories;

import com.team3.socialeventorganiser.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;


import java.sql.PreparedStatement;
import java.util.List;


@Repository
public class UserRepository {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public UserRepository(JdbcTemplate aTemplate) {
        jdbcTemplate = aTemplate;
    }

    public List<User> usersByEvent(int eventId) {

        return jdbcTemplate.query("select * from users where users.id in ( select event_user.user_id from event_user where event_user.event_id = " + eventId + ")" ,
                new Object[]{},
                (rs, i) -> new User(
                        rs.getInt("ID"),
                        rs.getString("EMAIL"),
                        rs.getString("FIRST_NAME"),
                        rs.getString("LAST_NAME")
                )
        );
    }

    public List<User> usersByEventStatus(int eventId, int status) {

        return jdbcTemplate.query("select * from users where users.id in ( select event_user.user_id from event_user where event_user.event_id =" + eventId + " and event_user.status =" + status + ")" ,
                new Object[]{},
                (rs, i) -> new User(
                        rs.getInt("ID"),
                        rs.getString("EMAIL"),
                        rs.getString("FIRST_NAME"),
                        rs.getString("LAST_NAME")
                )
        );
    }

    public List<User> allUsers(){
        return jdbcTemplate.query("SELECT * from users",
                new Object[]{},
                (rs, i) -> new User(
                        rs.getInt("ID"),
                        rs.getString("EMAIL"),
                        rs.getString("FIRST_NAME"),
                        rs.getString("LAST_NAME")
                )
        );
    }

    public User findUserByEmail(String email){
        User user = null;

        String sql = "SELECT * FROM users WHERE email = ?";

        try{
            return jdbcTemplate.queryForObject(sql, new Object[]{email}, (rs, rowNum) ->
                    new User(
                            rs.getInt("id"),
                            rs.getString("email"),
                            rs.getString("first_name"),
                            rs.getString("last_name")
                    ));
        }
        catch (Exception e){
            return user;
        }
    }

    public int going(int event_id, int user_id) {
        return jdbcTemplate.update("insert into event_user(event_id, user_id, status)  values(?,?,?) on duplicate key update status=2",
                event_id, user_id, 2);

    }

    public int notGoing(int event_id, int user_id) {
        return jdbcTemplate.update("insert into event_user(event_id, user_id, status)  values(?,?,?) on duplicate key update status=3",
                event_id, user_id, 3);

    }

    public int invite(int event_id, int user_id) {
        //Basically on duplicate key do nothing, that means a person cannot be invited two times
        //Or go to the invited status from the going or not going status
        return jdbcTemplate.update("insert into event_user(event_id, user_id, status)  values(?,?,?) on duplicate key update event_id=event_id",
                event_id, user_id, 1);

    }

    public int addUserToTeam(int userId, int teamId) {
        KeyHolder kh = new GeneratedKeyHolder();
        String sql = "insert into team_user (TEAM_ID, USER_ID)  values(?,?)";
        jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql, new String[]{"ID"}); //list of auto-generated key columns
                    ps.setInt(1, teamId);
                    ps.setInt(2, userId);
                    return ps;
                }
                , kh);
        //return Objects.requireNonNull(kh.getKey()).intValue();
        return 1;
    }

    public List<User> usersByTeam(int teamId){
        return jdbcTemplate.query("select * from users where users.id in ( select team_user.user_id from team_user where team_user.team_id =" + teamId + ")",
                new Object[]{},
                (rs, i) -> new User(
                        rs.getInt("ID"),
                        rs.getString("EMAIL"),
                        rs.getString("FIRST_NAME"),
                        rs.getString("LAST_NAME")
                )
        );
    }

    public User findUserById(int id){

        String sql = "SELECT * FROM users WHERE id = "+id;

        try{
            return jdbcTemplate.queryForObject(sql, new Object[]{}, (rs, rowNum) ->
                    new User(
                            rs.getInt("id"),
                            rs.getString("email"),
                            rs.getString("first_name"),
                            rs.getString("last_name")
                    ));
        }
        catch (Exception e){
            return null;
        }
    }

    public int removeUserFromTeam(int userID, int teamID) {
        return jdbcTemplate.update("DELETE FROM team_user WHERE team_user.user_id = " + userID + " and team_user.team_id = " + teamID);
    }
}

