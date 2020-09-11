package com.team3.socialeventorganiser.Repositories;


import com.team3.socialeventorganiser.Models.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Objects;

@Repository
public class TeamRepository {
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public TeamRepository(JdbcTemplate aTemplate) {
        jdbcTemplate = aTemplate;
    }

    public List<Team> teamsByEvent(int eventId){
        return jdbcTemplate.query("select * from teams where (teams.id in ( select event_team.team_id from event_team where event_team.event_id = "+ eventId +"))",
                new Object[]{},
                (rs, i) -> new Team(
                        rs.getString("NAME"),
                        rs.getInt("ID")
                )
        );
    }

    public int createTeam(String teamName){
        KeyHolder kh = new GeneratedKeyHolder();
        String sql="insert into teams(NAME)  values(?)";
        jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql, new String[]{"ID"}); //list of auto-generated key columns
                    ps.setString(1, teamName);
                    return ps;
                }
                , kh);
        return Objects.requireNonNull(kh.getKey()).intValue();
    }

    public int addTeamToEvent (int eventId, int teamId){
        return jdbcTemplate.update("insert into event_team (EVENT_ID, TEAM_ID)  values(?,?)", eventId, teamId);

    }

}
