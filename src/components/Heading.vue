<template>
  <section class="section1">
    <div class="bg"></div>
    <img class="pic" src="home-pic.png" />
    <div class="frame">
      <div class="text">
        <div class="heading">
          <span id="collab">Collab and Conquer <br /></span
          ><span id="meet"
            >Meet like-minded individuals <br />
            to work on projects</span
          >
        </div>
        <div class="subtitle">
          Enhance your portfolio with anyone, anywhere, anytime
        </div>
        <div class="button">
          <div class="label">Join our community here</div>
        </div>
      </div>
    </div>
  </section>
  <br />

  <section class="section2">
    <div class="clients">
      <div class="intro">
        <span id="title">Our Students <br /></span
        ><span id="description"
          >Our students come from various institution</span
        >
      </div>
      <div class="logos">
        <img style="width: 48px; height: 65px" src="client1.png" />
        <img style="width: 53px; height: 65px" src="client2.png" />
        <img style="width: 53px; height: 62px" src="client3.png" />
        <img style="width: 123px; height: 29px" src="client4.png" />
        <img style="width: 83px; height: 85px" src="client5.png" />
        <img style="width: 67px; height: 66px" src="client6.png" />
        <img style="width: 65px; height: 66px" src="client7.png" />
      </div>
    </div>
  </section>
  <br />
  <section class="section3">
    <div class="intro"><span id="title">Our Projects</span></div>
  </section>
</template>



<style scoped>
.section1 {
  height: 414.21px;
  position: relative;
}

.bg {
  width: 100%;
  height: 100%;

  position: absolute;
  background: #fdf8f6;
}

.pic {
  width: 500px;
  height: 356px;
  left: 921px;
  top: 29px;
  position: absolute;
}

.frame {
  height: 280.57px;
  left: 122px;
  top: 67px;
  position: absolute;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 22.27px;
  display: inline-flex;
}

.text {
  align-self: stretch;
  height: 234px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 11.14px;
  display: flex;
}

.heading {
  align-self: stretch;
}

#collab {
  color: #f5793b;
  font-size: 65px;
  font-family: Inter;
  font-weight: 600;
  line-height: 60px;
  word-wrap: break-word;
}

#meet {
  color: #4d4d4d;
  font-size: 55px;
  font-family: Inter;
  font-weight: 600;
  line-height: 55px;
  word-wrap: break-word;
}

.subtitle {
  align-self: stretch;
  color: #717171;
  font-size: 24px;
  font-family: Inter;
  font-weight: 400;
  line-height: 60px;
  word-wrap: break-word;
}

.button {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 32px;
  padding-left: 32px;
  background: #f5793b;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
}

.label {
  text-align: center;
  color: white;
  font-size: 20px;
  font-family: Inter;

  word-wrap: break-word;
}
</style>
