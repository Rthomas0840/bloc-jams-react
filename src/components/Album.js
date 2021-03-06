import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './Album.css';

class Album extends Component {
  constructor(props) {
   super(props);

     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });

     this.state = {
       album: album,
       currentSong: album.songs[0],
       isPlaying: false,
       currentTime: 0,
       duration: album.songs[0].duration,
       volume: 0,
     };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
   }

      play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
      }

      pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
      }

      componentDidMount() {
        this.eventListeners = {
          timeupdate: e => {
            this.setState({ currentTime: this.audioElement.currentTime });
          },
          volumeupdate: e => {
            this.setState({ volume: this.audioElement.volume });
          },
          durationchange: e => {
            this.setState({ duration: this.audioElement.duration });
          },
      };
        this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
      }

      componentWillUnmount() {
         this.audioElement.src = null;
         this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
         this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
         this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
       }


      setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
      }

      handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
          this.pause();
        } else {
          if (!isSameSong) { this.setSong(song); }
          this.play();
        }
      }

      handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play(newSong);
    }

      handleNextClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex + 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play(newSong);
      }

      handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
      }

      handleVolumeChange(e) {
        console.log("WhatUp");
        const newVolume =  e.target.value;
        this.audioElement.volume = newVolume;
        this.setState({ volume: newVolume });
      }

      formatTime(seconds) {
        console.log("SomethingsHappening");
          const mins = Math.floor(seconds / 60);
          const secs = Math.ceil(seconds % 60);
          if (secs < 10) {
          return (mins+":"+ 0 + secs);
        } else {
          return (mins + ":" + secs);
        }
}


   render() {
     return (
       <section className="album">
        <section id="album-info">
         <img id="album-cover-art" src={this.state.album.albumCover} alt="" />
          <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
          <table id="song-list">
            <colgroup>
              <col id="song-number-column" />
              <col id="song-title-column" />
              <col id="song-duration-column" />
            </colgroup>
            <tbody>
            {  this.state.album.songs.map( (song, index) =>
              <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
                 <td className="song-actions">
                   <button>
                     <span className="song-number">{index+1}</span>
                     <span className={this.props.isPlaying ? 'ion-pause' : 'ion-play'}></span>
                   </button>
                  </td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-duration">{this.formatTime(song.duration)}</td>
               </tr>
             )}
            </tbody>
          </table>
          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            currentTime={this.audioElement.currentTime}
            duration={this.state.duration}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
            formatTime={(seconds) => this.formatTime(seconds)} />
       </section>
     );
   }
 }


export default Album;
