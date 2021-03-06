import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { latLng, MapOptions, marker, Marker, Map, tileLayer } from 'leaflet';

import { CreateIssuePage } from '../create-issue/create-issue';
import { IssueProvider } from '../../providers/issue/issue';
import { Issue } from '../../models/issue';


/**
 * Generated class for the IssueMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-issue-map',
  templateUrl: 'issue-map.html',
})
export class IssueMapPage {

  issues: Issue[];
  mapOptions: MapOptions;
  mapMarkers: Marker[];
  userMarker: Marker;
  map: Map;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private issueService: IssueProvider,
    private geolocation: Geolocation,
  ) {
    this.mapMarkers = [];
  }

  ionViewDidLoad() {
    this.loadIssues();
    this.geolocation.getCurrentPosition().then(position => {
      console.log(`User is at ${position.coords.latitude}, ${position.coords.longitude}`);
      const tileLayerUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const tileLayerOptions = { maxZoom: 18 };
      this.mapOptions = {
        layers: [
          tileLayer(tileLayerUrl, tileLayerOptions)
        ],
        zoom: 13,
        center: latLng(position.coords.latitude, position.coords.longitude)
      };
    }).catch(err => {
      console.warn(`Could not retrieve user position because: ${err.message}`);
    });
  }

  private loadIssues(search?: string) {
    let searchedValue = search ? search : undefined;
    this.issueService.getIssues(['creator'], searchedValue, ['createdAt']).subscribe(issues => {
      this.issues = issues;
      issues.forEach((issue) => {
        this.mapMarkers.push(marker([issue.location.coordinates[1], issue.location.coordinates[0]]).bindTooltip(issue.description));
      });
    });
  }

  openCreateIssuePage(){
    this.navCtrl.push(CreateIssuePage);
  }

  onMapReady(map: Map){
    this.map = map;
  }
  
}
