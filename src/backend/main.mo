import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Import prefabricated components
  include MixinStorage();

  type MediaType = {
    #audio;
    #video;
    #photo;
  };

  type Media = {
    id : Text;
    title : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    mediaType : MediaType;
    creationDate : Time.Time;
  };

  type LoveLetter = {
    id : Text;
    title : Text;
    body : Text;
    creationDate : Time.Time;
  };

  // Store the persistent state inside the actor
  let persistentStore = {
    media = Map.empty<Text, Media>();
    loveLetters = Map.empty<Text, LoveLetter>();
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Media sorting functions:
  module Media {
    public func compare(media1 : Media, media2 : Media) : Order.Order {
      Text.compare(media1.title, media2.title);
    };

    public func compareByCreationDate(media1 : Media, media2 : Media) : Order.Order {
      Int.compare(media1.creationDate, media2.creationDate);
    };
  };

  // Love Letter functions:
  module LoveLetter {
    public func compare(loveLetter1 : LoveLetter, loveLetter2 : LoveLetter) : Order.Order {
      Text.compare(loveLetter1.title, loveLetter2.title);
    };

    public func compareByCreationDate(loveLetter1 : LoveLetter, loveLetter2 : LoveLetter) : Order.Order {
      Int.compare(loveLetter1.creationDate, loveLetter2.creationDate);
    };
  };

  // Media Management
  public query ({ caller }) func getMedia(id : Text) : async Media {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media");
    };
    switch (persistentStore.media.get(id)) {
      case (null) { Runtime.trap("Media item not found") };
      case (?media) { media };
    };
  };

  public query ({ caller }) func getAllMediaByTitle() : async [Media] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media");
    };
    persistentStore.media.values().toArray().sort();
  };

  public query ({ caller }) func getAllMediaByCreationDate() : async [Media] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media");
    };
    persistentStore.media.values().toArray().sort(Media.compareByCreationDate);
  };

  public shared ({ caller }) func createMedia(media : Media) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create media");
    };
    if (media.title == "") {
      Runtime.trap("Media title cannot be empty");
    };
    persistentStore.media.add(media.id, media);
    media.id;
  };

  public shared ({ caller }) func deleteMedia(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete media");
    };
    persistentStore.media.remove(id);
  };

  // Love Letters Management
  public query ({ caller }) func getLoveLetter(id : Text) : async LoveLetter {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view love letters");
    };
    switch (persistentStore.loveLetters.get(id)) {
      case (null) { Runtime.trap("Love letter not found") };
      case (?loveLetter) { loveLetter };
    };
  };

  public query ({ caller }) func getAllLoveLettersByTitle() : async [LoveLetter] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view love letters");
    };
    persistentStore.loveLetters.values().toArray().sort();
  };

  public query ({ caller }) func getAllLoveLettersByCreationDate() : async [LoveLetter] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view love letters");
    };
    persistentStore.loveLetters.values().toArray().sort(LoveLetter.compareByCreationDate);
  };

  public shared ({ caller }) func createLoveLetter(loveLetter : LoveLetter) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create love letters");
    };
    if (loveLetter.title == "") {
      Runtime.trap("Love letter title cannot be empty");
    };
    persistentStore.loveLetters.add(loveLetter.id, loveLetter);
    loveLetter.id;
  };

  public shared ({ caller }) func updateLoveLetter(id : Text, loveLetter : LoveLetter) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update love letters");
    };
    switch (persistentStore.loveLetters.get(id)) {
      case (null) { Runtime.trap("Love letter not found") };
      case (_) {
        persistentStore.loveLetters.add(id, loveLetter);
      };
    };
  };

  public shared ({ caller }) func deleteLoveLetter(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete love letters");
    };
    persistentStore.loveLetters.remove(id);
  };
};
