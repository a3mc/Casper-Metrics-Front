import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as SwaggerUI from 'swagger-ui';
import { ApiClientService } from '../services/api-client.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements AfterViewInit {

  constructor(
      private _apiClientService: ApiClientService
  ) { }

  ngAfterViewInit(): void {
    const ui = SwaggerUI({
      url: this._apiClientService.baseUrl + 'explorer/openapi.json',
      dom_id: '#swagger',
      tryItOutEnabled: true,
      syntaxHighlight: {
        activate : true,
        theme: 'nord'
      },
      displayRequestDuration: true
    });
  }

}
