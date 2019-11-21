package Controllers;

import Server.Main;
import Controllers.User;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import Controllers.User;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("WishList/")
public class WishList {

    @GET
    @Path("list")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String ListWishLists(@FormDataParam("userID") Integer userID) {
        JSONArray list = new JSONArray();
        try
        {
            if(userID == null){
                throw new Exception("One ore more form data parameters are missing in the HTTP request.");
            }
            PreparedStatement ps = Main.db.prepareStatement("SELECT ListName, Status FROM WishLists WHERE UserID = ?");
            ps.setInt(1,userID);
            ResultSet results = ps.executeQuery();
            while (results != null && results.next()) {
                JSONObject item = new JSONObject();
                item.put("listName", results.getString(1));
                item.put("Status",results.getBoolean(2));
                list.add(item);
            }
            return list.toString();
        } catch (Exception e) {
            System.out.println("Database error: " + e.getMessage());
            return "{\"error\": \"Unable to list items, please se server console for more info.\"}";
        }

    }

    @POST
    @Path("add")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String New(@FormDataParam("token") String token,@FormDataParam("listName") String listName,@FormDataParam("status") Boolean status){
        try{
            if (token == null || listName == null || status == null){
                throw new Exception("One ore more form data parameters are missing in the HTTP request.");
            }
            int userID = User.validateTokenv2(token);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO WishLists (UserID, ListName, Status) Values(?,?,?)");
            ps.setInt(1,userID);
            ps.setString(2,listName);
            ps.setBoolean(3,status);
            ps.executeUpdate();
            return "{\"status\": \"OK\"}";
        }catch(Exception e){
            System.out.println("Database error: " + e.getMessage());
            return "{\"error\": \"Unable to create new list, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("rename")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String Rename(@FormDataParam("token") String token,@FormDataParam("oldListName") String oldListName, @FormDataParam("listName") String listName){
        try{
            if(token == null || oldListName == null || listName == null){
                throw new Exception("One ore more form data parameters are missing in the HTTP request.");
            }
            int userID = User.validateTokenv2(token);
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT ListName FROM WishLists WHERE UserID = ?");
            ps1.setInt(1,userID);
            ResultSet results = ps1.executeQuery();
            if(results.next()){
                PreparedStatement ps = Main.db.prepareStatement("UPDATE WishLists SET ListName = ? WHERE UserID = ? And ListName = ?");
                ps.setString(1, listName);
                ps.setInt(2, userID);
                ps.setString(3,oldListName);
                ps.executeUpdate();
                return "{\"status\": \"OK\"}";
            } else {
                return "{\"error\": \"There isn\'t a list with that ID\"}";
            }
        } catch (Exception e) {
            System.out.println("Database error: " + e.getMessage());
            return "{\"error\": \"Unable to rename the list, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("status")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String Status(@FormDataParam("token") String token,@FormDataParam("listName") String listName, @FormDataParam("status") Boolean status){
        try{
            if(token == null || listName == null ||status == null){
                throw new Exception("One ore more form data parameters are missing in the HTTP request.");
            }
            int userID = User.validateTokenv2(token);
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT ListName FROM WishLists WHERE UserID = ?");
            ps1.setInt(1,userID);
            ResultSet results = ps1.executeQuery();
            if(results.next()) {
                PreparedStatement ps = Main.db.prepareStatement("UPDATE WishLists SET Status = ? WHERE UserID = ?");
                ps.setBoolean(1, status);
                ps.setInt(2, userID);
                ps.executeUpdate();
            } else{
                return "{\"error\": \"There isn\'t a list with that ID\"}";
            }
            return "{\"status\": \"OK\"}";
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "{\"error\": \"Unable to change the status of the list, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("delete")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String Delete(@FormDataParam("token") String token, @FormDataParam("listName") String listName){
        try{
            if(token == null || listName == null){
                throw new Exception("One ore more form data parameters are missing in the HTTP request.");
            }
            int userID = User.validateTokenv2(token);
            PreparedStatement ps1 = Main.db.prepareStatement("Select ListName From WishLists Where UserID = ?");
            ps1.setInt(1,userID);
            ResultSet results = ps1.executeQuery();
            if(results.next()){
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM WishLists WHERE UserID = ? And ListName = ?");
                ps.setString(2,listName);
                ps.setInt(1,userID);
                ps.executeUpdate();
                return "{\"status\": \"OK\"}";
            } else {
                return "{\"error\": \"There isn\'t a list with that ID\"}";
            }
        }catch(Exception e){
            System.out.println(e.getMessage());
            return "{\"error\": \"Unable to delete wishList, please see server console for more info.\"}";
        }
    }
}