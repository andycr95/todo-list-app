import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationsComponent } from './configurations.component';

describe('ConfigurationsComponent', () => {
  let component: ConfigurationsComponent;
  let fixture: ComponentFixture<ConfigurationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConfigurationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
